const logger = require('loglevel');
const scraping = require('../../config/scraping');
const axios = require('axios');
const cheerio = require('cheerio');

// logger.setLevel('info', false);


async function getInformationAboutStrainFromLeaflyScraper(category, strain) {
    try {
        let response = await axios.get(scraping.leafly.url + category + "/" + strain);
        let html = response.data;
        let $ = cheerio.load(html);

        let result = await Promise.all([
            getWhatIs($),
            getFlavorInfo($),
            getMostPopularIn($),
            getSimilarStrains($)
        ]);


        return result;
    } catch (error) //Sending to error page in caller functions
    {
        return null;
    }
}

async function getWhatIs($) {

    let obj = {};
    obj["what is"] = $(scraping.leafly.whatIs.whatIsCSSPath).text();

    return obj;
}


async function getFlavorInfo($) {

    let flavorInfo = {};
    $(scraping.leafly.flavorInfo.flavorInfoCSSPath).each(function (i) {

        flavorInfo[i] = $(this).text().trim();
    });

    return flavorInfo;

}

async function getMostPopularIn($) {


    let popularLocations = {};
    $(scraping.leafly.mostPopularIn.mostPopularInCSSPath).each(function (i) {


        popularLocations[i] = $(this).text().trim();
    });


    return popularLocations;

}

async function getSimilarStrains($) {

    let similarStrains = {};
    $(scraping.leafly.similarStrains.containerCSSPath).each(function (i) {
        similarStrains[i] = $(this).find(scraping.leafly.similarStrains.strainsNamesCSSPath).last().text();
    });

    return (similarStrains);

}

async function getReviews(type, strain)
{
    try
    {

        let response = await axios.get(scraping.leafly.url + type + '/' + strain + '/' + scraping.leafly.reviews.resource);
        let html = response.data;
        let $ = cheerio.load(html);
        let reviews = {};
        $(scraping.leafly.reviews.histogram.containerCSSPath).each((i, elem) => {
            let label = $(elem).find(scraping.leafly.reviews.histogram.labelCSSPath).first().text();
            let value = $(elem).find(scraping.leafly.reviews.histogram.valueCSSPath).first().css('width');
            reviews[label] = value;
        });
        return {reviews: reviews};
    }
    catch(error)
    {

        return {reviews: null};
    }
}

module.exports.getInformationAboutStrainFromLeaflyScraper = getInformationAboutStrainFromLeaflyScraper;
module.exports.getReviewsFromLeafly = getReviews;