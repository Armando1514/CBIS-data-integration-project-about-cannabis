const logger = require('loglevel');
const scraping = require('../../config/scraping');
const request = require('request');
const cheerio = require('cheerio');

logger.setLevel('info', false);

async function getWhatIs(category, strain) {
    request(scraping.leafly.url + category + '/' + strain, function (err, resp, html) {
        if (!err) {
            const $ = cheerio.load(html);

            let whatIs = $(scraping.leafly.whatIs.whatIsCSSPath).text();

            console.log(whatIs);
        }
    });
}

module.exports.getWhatIs = getWhatIs;

// Testing
getWhatIs("indica", "ingrid");