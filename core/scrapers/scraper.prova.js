const logger = require('loglevel')
const scraping = require('../../config/scraping');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

logger.setLevel('info', false);

async function getTime() {
    axios.get(scraping.prova.url)
    .then( response => {
        // logger.info(response.data);
        let doc = new DOMParser().parseFromString(response.data);
        // lgger.info(doc);
        let time = xpath.select(scraping.prova.timeXPath, doc);
        logger.info(time[0].data.trim());
    })
    .catch(error => {
        logger.error(error);
    })
}

// Testing
getTime();

/* EXPORTS */
// // Choosing export name of the function
// module.exports.ExportName = getTime;
//         // or
// module.exports = {
//     getTime,
//     ... other function ...,

// }