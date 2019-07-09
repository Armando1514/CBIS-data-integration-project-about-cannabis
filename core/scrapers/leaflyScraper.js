const logger = require('loglevel');
const scraping = require('../../config/scraping');
const axios = require('axios');
const cheerio = require('cheerio');

logger.setLevel('info', false);


async function getInformationAboutStrainToLeaflyScraper(category, strain) {
    axios.get(scraping.leafly.url + category + '/' + strain)
        .then(async response => {

            let html = response.data;
            let $ = cheerio.load(html);
            try {
                let result = await Promise.all([
                    await getWhatIs($),
                    await getFlavorInfo($),
                    await getMostPopularIn($),
                    await getSimilarStrains($)
                ]);

                logger.info(result[0]);
                logger.info(result[1]);
                logger.info(result[2]);
                logger.info(result[3]);

                return result;
            } catch (err) {
                logger.error("ERROR OCCURRED IN LEAFLYSCRAPER : " + err);
                return undefined;
            }
        })
        .catch(err => {
            logger.error("ERROR RELATED TO REQUEST IN LEAFLYSCRAPER" + err);
            return undefined; //Sending to error page in caller functions
        })
}


async function getWhatIs($) {

    return '{"whatIs":"' + $(scraping.leafly.whatIs.whatIsCSSPath).text() + '"}';


}


async function getFlavorInfo($) {

    let flavorInfo = "{";
    $(scraping.leafly.flavorInfo.flavorInfoCSSPath).each(function (i) {
        if (i !== 0)
            flavorInfo = flavorInfo + ",";
        let flavorType = '"' + "flavor" + (i + 1) + '"' + ':"' + $(this).text() + '"';
        flavorInfo = flavorInfo + flavorType;
    });

    flavorInfo = flavorInfo + "}";

    return flavorInfo;

}

async function getMostPopularIn($) {


    let popularLocations = "{";
    $(" .popular-locations li ").each(function (i) {

        if (i !== 0)
            popularLocations = popularLocations + ",";
        let locations = '"' + "location" + (i + 1) + '"' + ':"' + $(this).text() + '"';
        popularLocations = popularLocations + locations;
    });

    popularLocations = popularLocations + "}";

    return popularLocations;

}

async function getSimilarStrains($) {

    let similarStrains = [];
    $(".lineage-parents > ul > li").each(function () {
        similarStrains.push($(this).find('a > div > div > div').last().text());
    });

    return (similarStrains);

}

