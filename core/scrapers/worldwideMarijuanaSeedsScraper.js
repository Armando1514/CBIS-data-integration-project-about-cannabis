const logger = require('loglevel');
const scraping = require('../../config/scraping');
const axios = require('axios');
const cheerio = require('cheerio');

logger.setLevel('info', false);

// async function getPrice(resource)
// {
//     axios.get(scraping.worldwideMarijuanaSeeds.baseURL + resource)
//     .then(response => {
//         let html = response.data;
//         let $ = cheerio.load(html);
//         let price = $('#product-price span').first().text();
//         logger.info(price);
//         return price;
//     })
//     .catch(error => {
//         logger.error(error);
//         return undefined;
//     })
// }

async function getStrainPrice(strain) {
    axios.get(scraping.worldwideMarijuanaSeeds.baseURL + scraping.worldwideMarijuanaSeeds.queryString + strain)
    .then( response => {
        let html = response.data;
        let $ = cheerio.load(html);
        let searchResult = $(scraping.worldwideMarijuanaSeeds.searchResult.searchResultCSSPath);
        if (searchResult.text().trim() != '')
        {
            // let firstLink = searchResult.find('.product-index-inner').first().find('a');
            // let strainURL = firstLink['0'].attribs.href;
            // logger.info(strainURL);
            // return getPrice(strainURL);
            let price = searchResult.find(scraping.worldwideMarijuanaSeeds.price.priceCSSPath).first().text().trim();
            logger.info(price);
            return price;
        }
        else
        {
            logger.info("No result");
            return null;
        }
    })
    .catch(error => {
        logger.error(error);
        return undefined; //Sending to error page in caller functions
    })
}

module.exports.getStrainPrice = getStrainPrice;

// Testing
getStrainPrice('ak-48');