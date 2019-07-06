const logger = require('loglevel');
const strainTypes = require('../../config/strainTypes');
const scraping = require('../../config/scraping');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

logger.setLevel('info', false);

async function getStrains() {
    axios.get(scraping.wikipedia.url)
    .then( response => {
        let doc = new DOMParser().parseFromString(response.data);
        var strains = [];
        for (type of strainTypes)
        {
            var typeStrains = [];
            let xPaths = scraping.wikipedia[type];
            for (xPath in xPaths)
            {
                let xPathStrains = xpath.select(scraping.wikipedia[type][xPath], doc);
                xPathStrains.forEach(strain => {
                    typeStrains.push(strain.data.toString());
                })
            }
            strains.push(typeStrains);
        }
        logger.info(JSON.stringify(strains, null, 4));
        return strains;
    })
    .catch(error => {
        logger.error(error);
        return undefined; //Sending to error page in caller functions
    })
}

module.exports.getStrains = getStrains;

// Testing
getStrains();