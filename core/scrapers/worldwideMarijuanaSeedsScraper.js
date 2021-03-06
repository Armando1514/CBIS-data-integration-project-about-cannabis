const scraping = require('../../config/scraping');
const axios = require('axios');
const cheerio = require('cheerio');


// logger.setLevel('info', false);

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

async function getInformationAboutStrainFromWorldWideMarijuanaSeedsScraper(strain) {
    try {
        let response = await await axios.get(scraping.worldwideMarijuanaSeeds.baseURL + scraping.worldwideMarijuanaSeeds.queryString + strain);
        let resObj = {};
        let html = response.data;
        let $ = cheerio.load(html);
        let searchResult = $(scraping.worldwideMarijuanaSeeds.searchResult.searchResultCSSPath);
        if (searchResult.text().trim() !== '') {
            // let firstLink = searchResult.find('.product-index-inner').first().find('a');
            // let strainURL = firstLink['0'].attribs.href;
            // logger.info(strainURL);
            // return getPrice(strainURL);
            resObj.price = searchResult.find(scraping.worldwideMarijuanaSeeds.price.priceCSSPath).first().text().trim();
            return resObj;
        } else {
            resObj["price"] = null;

            return resObj;
        }
    } catch (error) {
        let resObj = {};
        resObj["price"] = null;

        return resObj;
    }
}


module.exports.getInformationAboutStrainFromWorldWideMarijuanaSeedsScraper = getInformationAboutStrainFromWorldWideMarijuanaSeedsScraper;