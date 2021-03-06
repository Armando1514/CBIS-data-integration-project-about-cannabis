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
            getGeneralInfo($),
            getPicture($),
            getVideo($)
        ]);
        console.log("rino" + JSON.stringify(result));

        return result;

    } catch (error) //Sending to error page in caller functions
    {
        console.log("dsa" + error);

        return null;
    }
}

async function getPicture($) {
    obj = {};
    obj["picture"] = $(scraping.iLoveGrowingMarijuana.image.imageCSSPath).attr('src');
    return obj;
}

async function getVideo($) {
    obj = {};
    obj["video"] = $(scraping.iLoveGrowingMarijuana.video.videoCSSPath).attr('src');
    return obj;
}

async function getInformationTable($) {

    let tableInfo = {};
    let previousProperty;

    $(scraping.iLoveGrowingMarijuana.informationTable.informationTableCSSPath).each(function () {

        //only the values that i want
        // regex for check if the string is composed by characters and not numbers
        var patt = new RegExp("([A-Za-z])\\w+");

        //if is uppercase, does it means that is an element (only characters not numbers) , not a content
        if (patt.test($(this).text()) && $(this).text().trim() === $(this).text().trim().toUpperCase()) {

            tableInfo[$(this).text().toLowerCase().replace(/ +/g, "")];

            previousProperty = $(this).text().toLowerCase().replace(/ +/g, "");



        } else {

            // control if there are <br> tag, does it means that is a composite object
            if ($(this).html().search("br") > 0) {


                tableInfo[previousProperty] = {};
                //create the delimiter
                let text = $(this).html().replace(/<br\s*[\/]?>/gi, "\n").replace(/&#x2013;/gi, "–");
                let tmp = text.split(/\s*\n\s*/);

                for (let j in tmp) {


                    //take the two elements separated by -
                    let content1 = tmp[j].split("–")[0];
                    let content2 = tmp[j].split("–")[1];

                    if (content1 !== undefined && content2 !== undefined)
                        tableInfo[previousProperty][content1.toLocaleLowerCase().trim()] = parseInt(content2.trim());

                }


            } else {

                tableInfo[previousProperty] = $(this).text().trim();

            }
        }

    });
    console.log(JSON.stringify(tableInfo));

    return tableInfo;

}


async function getGeneralInfo($) {


    let generalInfo = {};
    let previousDescription = "";
    let index = 0;
    let titleArray = [""];

    // take all the title of the sections
    $(scraping.iLoveGrowingMarijuana.generalInfo.sectionTitleCSSPath).each(function (i) {
        console.log($(this).text());

        titleArray[i] = $(this).text() + " description";
    });

    $(scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.selectSectionsCSSPath).nextUntil(scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.sectionsUntilFirstCSSPath, scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.filterSelectorCSSPath).each(function () {

        if (titleArray[index] === $(this).text() + " description") {
            if (index !== 0) {


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

    if (JSON.stringify(generalInfo) !== JSON.stringify("{}"))
        if (generalInfo[titleArray[index - 1].toLowerCase()] === "")
            generalInfo[titleArray[index - 1].toLowerCase()] = previousDescription;


    delete generalInfo["top 50 marijuana strains" + " description"];
    return generalInfo;

}

async function getImage(strain) {
    try {
        let response = await axios.get(scraping.iLoveGrowingMarijuana.url + strain);
        let html = response.data;
        let $ = cheerio.load(html);
        let imageURL = $(scraping.iLoveGrowingMarijuana.image.imageCSSPath).first().attr('src');
        if (imageURL === undefined) {
            logger.info(strain + 'image not found');
            return null;
        } else {
            logger.info(imageURL);
            return imageURL;
        }
    } catch (error) {
        // logger.error(error);
        logger.info(strain + ' page not found');
        return null;
    }
}

module.exports.getInformationAboutStrainFromILoveGrowingMarijuanaScraper = getInformationAboutStrainFromILoveGrowingMarijuanaScraper;
module.exports.getImageFromILoveGrowingMarijuana = getImage;

// getImage('ak-48');