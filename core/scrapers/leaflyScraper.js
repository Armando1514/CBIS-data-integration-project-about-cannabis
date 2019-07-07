const logger = require('loglevel');
const scraping = require('../../config/scraping');
const growingElements = require('../../config/growingInfo');
const request = require('request');
const cheerio = require('cheerio');

logger.setLevel('info', false);

async function getWhatIs(category, strain) {
    request(scraping.leafly.url + category + '/' + strain, function (err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);

            let whatIs = $(scraping.leafly.whatIs.whatIsCSSPath).text();

            console.log(whatIs);
        }
    });
}

async function getGrowingInfo(category, strain) {
    request(scraping.leafly.url + category + '/' + strain, function (err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let growingInfo = "{";
            let info = $(scraping.leafly.growingInfo.growingInfoCSSPath).each(function (i, elem) {
                if (i != 0)
                    growingInfo = growingInfo + ",";
                let infoType = '"' + growingElements[i] + '"' + ':"' + $(this).text() + '"';
                growingInfo = growingInfo + infoType;
            });

            growingInfo = growingInfo + "}";
            console.log(growingInfo);
            let growingInfo1 = JSON.parse(growingInfo);
            console.log(growingInfo1.flowering);
        }
    });
}


async function getFlavorInfo(category, strain) {
    request(scraping.leafly.url + category + '/' + strain, function (err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let flavorInfo = "{";
            let info = $(scraping.leafly.flavorInfo.flavorInfoCSSPath).each(function (i, elem) {
                if (i != 0)
                    flavorInfo = flavorInfo + ",";
                let flavorType = '"' + "flavor" + (i + 1) + '"' + ':"' + $(this).text() + '"';
                flavorInfo = flavorInfo + flavorType;
            });

            flavorInfo = flavorInfo + "}";
            console.log(flavorInfo);
            let flavorInfo1 = JSON.parse(flavorInfo);
            console.log(flavorInfo1.flavor2);
        }
    });
}

async function getMostPopularIn(category, strain) {
    request(scraping.leafly.url + category + '/' + strain, function (err, resp, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let popularLocations = "{";
            let info = $(" .popular-locations li ").each(function (i, elem) {

                if (i != 0)
                    popularLocations = popularLocations + ",";
                let locations = '"' + "location" + (i + 1) + '"' + ':"' + $(this).text() + '"';
                popularLocations = popularLocations + locations;
            });

            popularLocations = popularLocations + "}";
            console.log(popularLocations);
            let popularLocations1 = JSON.parse(popularLocations);
            console.log(popularLocations1.location3);
        }
    });
}


module.exports.getWhatIs = getWhatIs;

// Testing
getMostPopularIn("hybrid", "lemon-skunk");