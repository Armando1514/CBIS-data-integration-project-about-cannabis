const iLoveGrowingMarijuanaScraper = require('../../core/scrapers/iLoveGrowingMarijuanaScraper');
const leaflyScraper = require('../../core/scrapers/leaflyScraper');
const wikileafScraper = require('../../core/scrapers/wikileafScraper');
const dbManager = require('../../core/db/connection');
const merge = require('merge-deep');
const logger = require('loglevel');

// logger.setLevel('info', false);


async function getStrainInfo(category, strain) {
    let db = dbManager.getDatabase();
    let collection = db.collection("strainsInfoCache");
    let query = {
        name: strain
    };
    let insertIntoDB = false;

    let result = await collection.findOne(query).then(result => {

        //control if the value is in cache
        // if i didn't find the strain, i need to call the scrapers
        if (result !== null) {
            //check if the result is older than 1 month
            //take the date from the id of the result
            let timestamp = result._id.toString().substring(0, 8);
            //convert to a readable date
            let date1 = new Date(parseInt(timestamp, 16) * 1000);
            //take my date
            let date2 = new Date();

            // if there is more than one month of difference between the dates, i need to call again the scrapers, otherwise i return the result from the cache.
            if (monthDiff(date1, date2) === 0) {

                return result;
            }
            // call the scrapers
            else {
                console.log("the element is older than 1 month, removing...");

                //remove the old element
                collection.deleteOne(query);
                insertIntoDB = true;
                return null;
            }
        }


    }).then(result => {


        if (result == null) {
            insertIntoDB = true;

        } else {
            return result;
        }
    }).catch(err => {
        logger.error(err);
    });
    if (insertIntoDB) {

        result = await getScrapersElements(category, collection, strain);
        if (result == null)
            return null;

        let obj = {};
        obj["name"] = strain;
        obj = merge(obj, result);

        collection.findOne(query).then(searched => {
            if (searched == null) {

                insertElement(collection, obj);

                console.log("elemento inserted");


            }

        });

        return obj;
    }

    return result;

}


function getScrapersElements(category, collection, strain) {
    return Promise.all([
        iLoveGrowingMarijuanaScraper.getInformationAboutStrainFromILoveGrowingMarijuanaScraper(strain),
        leaflyScraper.getInformationAboutStrainFromLeaflyScraper(category, strain),
        wikileafScraper.getInformationAboutStrainFromWikiLeafScraper(strain)

    ]).then(values => {


        merge({
            name: strain
        }, values[0], values[1], values[2]);
        //if at least one scraper (from the first two, that are info about the seeds) get a info, insert.
        if (values[0] != null || values[1] != null) {
            return values;
        } else {
            return null;
        }
    }).catch(err => {
        logger.error(err);
    });

}


function insertElement(collection, obj) {

    collection.insertOne(obj, function (err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
    });
    // i don't care if is not blocking the previous statement, because i need to know the obj, also if there is an error related to storage
    return obj;

}


//calculate the difference in month between two dates (0 if the difference is less than one month)
function monthDiff(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

module.exports.getStrainInfo = getStrainInfo;


// getStrainInfo("hybrid", "girl-scout-cookies");