const logger = require('loglevel');
const scraping = require('../../config/scraping');
const cheerio = require('cheerio');
const axios = require('axios');

logger.setLevel('info', false);

async function getInformationAboutStrainToILoveGrowingMarijuanaScraper(strain) {
    axios.get(scraping.iLoveGrowingMarijuana.url + strain)
        .then(async response => {

            let html = response.data;
            let $ = cheerio.load(html);
            try {
                let result = [];
                result[0] = await getInformationTable($);
                result[1] = await getGeneralInfo($);

                logger.info(result[0]);
                logger.info(result[1]);

                return result;
            } catch (err) {
                logger.error("ERROR OCCURRED IN ILOVEGROWINGMARIJUANASCRAPER : " + err);
                return undefined;
            }
        })
        .catch(err => {
            logger.error("ERROR RELATED TO REQUEST IN ILOVEGROWINGMARIJUANASCRAPER" + err);
            return undefined; //Sending to error page in caller functions
        })
}


async function getInformationTable($) {


    let tableInfo = "{";
    let element = "";
    let content = "";
    let index = 0;


    $(scraping.iLoveGrowingMarijuana.informationTable.informationTableCSSPath).each(function (i) {

        //only the values that i want
        element = "";
        // regex for check if is the string is composed by characters and not numbers
        var patt = new RegExp("([A-Za-z])\\w+");

        //if is uppercase, does it means that is an element (only characters not numbers) , not a content
        if (patt.test($(this).text()) && $(this).text().trim() === $(this).text().trim().toUpperCase()) {
            if (i !== 0)
                tableInfo = tableInfo + ",";

            element = '"' + $(this).text().toLowerCase() + '"' + ':';

            index++;

            tableInfo = tableInfo + element;


        } else {

            // control if there are <br> tag, does it means that is a composite object
            if ($(this).html().search("br") > 0) {

                element = element + "{";
                //array of elements divided by -
                let tmp = $(this).text().split(/\s*\n\s*/);
                for (let j in tmp) {

                    if (j !== 0)
                        element = element + ",";


                    //take the two elements separated by -
                    let content1 = tmp[j].split("–")[0];
                    let content2 = tmp[j].split("–")[1];


                    content = '"' + content1.trim() + '":"' + content2.trim() + '"';

                    element = element + content;

                }

                element = element + "}";
                tableInfo = tableInfo + element;

            } else {
                content = '"' + $(this).text() + '"';
                tableInfo = tableInfo + content;

            }

        }

    });

    tableInfo = tableInfo + "}";

    return tableInfo;

}


async function getGeneralInfo($) {

    let generalInfo = "{";
    let index = 0;
    let titleArray = [""];

    // take all the title of the sections
    $(scraping.iLoveGrowingMarijuana.generalInfo.sectionTitleCSSPath).each(function (i) {

        titleArray[i] = $(this).text();
    });

    $(scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.selectSectionsCSSPath).nextUntil(scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.sectionsUntilFirstCSSPath, scraping.iLoveGrowingMarijuana.generalInfo.sectionContent.filterSelectorCSSPath).each(function () {

        if (titleArray[index] === $(this).text().trim()) {

            if (index !== 0)
                generalInfo = generalInfo + '",';

            generalInfo = generalInfo + '"' + titleArray[index].toLowerCase() + '" : "';

            index++;


        } else {


            let description = $(this).text().replace("\n", " ");

            generalInfo = generalInfo + description;

        }

    });

    generalInfo = generalInfo + '"}';

    return generalInfo;

}

