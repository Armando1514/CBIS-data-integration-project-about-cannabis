const logger = require('loglevel');
const strainTypes = require('../../config/strainTypes');
const scraping = require('../../config/scraping');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

// logger.setLevel('info', false);

async function getTypeStrains(doc, type) {
    var typeStrains = [];
    let xPaths = scraping.wikipedia[type];
    for (xPath in xPaths) {
        let xPathStrains = xpath.select(scraping.wikipedia[type][xPath], doc);
        xPathStrains.forEach(strain => {
            let strainObj = {};
            strainObj.name = strain.data;
            strainObj.type = type;
            typeStrains.push(strainObj);
        });
    }
    return typeStrains;
}

async function getStrains() {
    try {
        let response = await axios.get(scraping.wikipedia.url);
        let doc = new DOMParser().parseFromString(response.data);
        return await Promise.all([
            getTypeStrains(doc, strainTypes[0]),
            getTypeStrains(doc, strainTypes[1]),
            getTypeStrains(doc, strainTypes[2])
        ])
        // logger.info(JSON.stringify(result, null, 4));
    } catch (error) //Sending to error page in caller functions
    {
        logger.error(error);
        return undefined;
    }
}

module.exports.getStrainsFromWikipedia = getStrains;

// Testing
// getStrains();