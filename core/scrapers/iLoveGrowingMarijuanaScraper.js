const logger = require('loglevel');
const scraping = require('../../config/scraping');
const cheerio = require('cheerio');
const axios = require('axios');

logger.setLevel("info", false);

async function getInformationAboutStrainFromILoveGrowingMarijuanaScraper(strain) {
    try {
        let response = await axios.get(scraping.iLoveGrowingMarijuana.url + strain);
        let html = response.data;
        let $ = cheerio.load(html);
        let result = await Promise.all([
            getInformationTable($),
            getGeneralInfo($)
        ]);

        return result;

    } catch (error) //Sending to error page in caller functions
    {
        let obj = null;
        logger.error(error);
        return obj;
    }
}


async function getInformationTable($) {

    let tableInfo = {};
    let previousProperty;

    $(scraping.iLoveGrowingMarijuana.informationTable.informationTableCSSPath).each(function () {

        //only the values that i want
        element = "";
        // regex for check if is the string is composed by characters and not numbers
        var patt = new RegExp("([A-Za-z])\\w+");

        //if is uppercase, does it means that is an element (only characters not numbers) , not a content
        if (patt.test($(this).text()) && $(this).text().trim() === $(this).text().trim().toUpperCase()) {

            tableInfo[$(this).text().toLowerCase()];

            previousProperty = $(this).text().toLowerCase();



        } else {

            // control if there are <br> tag, does it means that is a composite object
            if ($(this).html().search("br") > 0) {

                tableInfo[previousProperty] = {};
                //array of elements divided by -
                let tmp = $(this).text().split(/\s*\n\s*/);
                for (let j in tmp) {

                    //take the two elements separated by -
                    let content1 = tmp[j].split("–")[0];
                    let content2 = tmp[j].split("–")[1];

                    tableInfo[previousProperty][content1.trim()] = content2.trim();

                }


            } else {

                tableInfo[previousProperty] = $(this).text().trim();

            }
        }
    });


    return tableInfo;

}


async function getGeneralInfo($) {

    let generalInfo = {};
    let previousDescription = "";
    let index = 0;
    let titleArray = [""];

    // take all the title of the sections
    $(scraping.iLoveGrowingMarijuana.generalInfo.sectionTitleCSSPath).each(function (i) {

        titleArray[i] = $(this).text() + " description";
    });

    $(scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.selectSectionsCSSPath).nextUntil(scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.sectionsUntilFirstCSSPath, scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.filterSelectorCSSPath).each(function () {

        if (titleArray[index] === $(this).text() + " description") {

            if (index != 0) {
                generalInfo[titleArray[index - 1].toLowerCase()] = previousDescription.trim();

                previousDescription = "";
            }

            generalInfo[titleArray[index].toLowerCase()] = "";

            index++;


        } else {


            let description = $(this).text().replace("\n", " ");

            previousDescription = previousDescription + description;

        }

    });

    delete generalInfo["top 50 marijuana strains" + " description"];

    return generalInfo;

}

async function getImage(strain)
{
    try
    {
        let response = await axios.get(scraping.iLoveGrowingMarijuana.url + strain);
        let html = response.data;
        let $ = cheerio.load(html);
        let imageURL = $(scraping.iLoveGrowingMarijuana.image.imageCSSPath).first().attr('src');
        if (imageURL === undefined)
        {
            logger.info(strain + 'image not found');
            return null;
        }
        else
        {
            logger.info(imageURL);
            return imageURL;
        }
    }
    catch (error)
    {
        // logger.error(error);
        logger.info(strain + ' page not found');
        return null;
    }
}

module.exports.getInformationAboutStrainFromILoveGrowingMarijuanaScraper = getInformationAboutStrainFromILoveGrowingMarijuanaScraper;
module.exports.getImageFromILoveGrowingMarijuana = getImage;

// getImage('ak-48');