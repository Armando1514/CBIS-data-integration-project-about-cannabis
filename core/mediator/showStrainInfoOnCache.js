const iLoveGrowingMarijuanaScraper = require('../../core/scrapers/iLoveGrowingMarijuanaScraper');
const leaflyScraper = require('../../core/scrapers/leaflyScraper');
const worldwideMarijuanaSeedsScraper = require('../../core/scrapers/worldwideMarijuanaSeedsScraper');
const wikileafScraper = require('../../core/scrapers/wikileafScraper');
const dbManager = require('../../core/db/connection');
var AsyncLock = require('async-lock');
const merge = require('merge-deep');
const logger = require('loglevel');

// logger.setLevel('info', false);

dbManager.createInitialConnection();


const sleep = (milliseconds = 2000) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function getStrainInfo(category, strain) {
    await sleep(2000)

    let lock

    let db = dbManager.getDatabase();
    let collection = db.collection("strainsInfoCache");

    //control if the value is in cache
    let query = {
        name: strain
    };
    collection.findOne(query, function (err, result) {
        if (err) throw err;
        // if i didn't find the strain, i need to call the scrapers
        if (result != null) {
            //check if the result is older than 1 month
            //take the date from the id of the result
            timestamp = result._id.toString().substring(0, 8)
            //convert to a readable date
            let date1 = new Date(parseInt(timestamp, 16) * 1000);
            //take my date
            let date2 = new Date();
            console.log(monthDiff(date1, date2));

            // if there is more than one month of difference between the dates, i need to call again the scrapers, otherwise i return the result from the cache.
            if (monthDiff(date1, date2) == 0) {
                return result;
            } else {
                // it's shared between differents client, i don't want duplicate in  my database, lock ensures mutual exclusion.
                lock = new AsyncLock();
                lock.acquire("key1", function (done) {
                    collection.findOne(query, function (err, result) {
                        if (err) throw err;
                        if (result == null)
                            insertElement(category, collection, strain);
                        else return result;
                    });
                }, function (err, ret) {
                    console.log("lock rilasciato");
                    // lock released
                }, {});
            }
        }
    });

    // there is not the element in cache, i need to call the scrapers
    lock = new AsyncLock();
    lock.acquire("key1", function (done) {
        //check again if someone has inserted the  value in the cache.
        collection.findOne(query, function (err, result) {
            if (err) throw err;
            if (result == null)
                insertElement(category, collection, strain);
            else return result;
        });
        done();
    }, function (err, ret) {
        console.log("lock rilasciato");
        // lock released
    }, {});


}


async function insertElement(category, collection, strain) {
    await Promise.all([
        iLoveGrowingMarijuanaScraper.getInformationAboutStrainFromILoveGrowingMarijuanaScraper(strain),
        leaflyScraper.getInformationAboutStrainFromLeaflyScraper(category, strain),
        wikileafScraper.getInformationAboutStrainFromWikiLeafScraper(strain)

    ]).then(values => {
        var obj = {};

        obj = merge({
            name: strain
        }, values[0], values[1], values[2]);
        collection.insertOne(obj, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            return obj;
        });
    });
}


//calculate the difference in month between two dates (0 if the difference is less than one month)
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

module.exports.getStrainInfo = getStrainInfo;


getStrainInfo("hybrid", "girl-scout-cookies");