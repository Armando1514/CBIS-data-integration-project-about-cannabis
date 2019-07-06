const scraping = require('../../config/scraping');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

async function getTime() {
    axios.get(scraping.prova.url)
    .then( response => {
    // console.log(response.data);
    var doc = new DOMParser().parseFromString(response.data);
    // console.log(doc);
    var time = xpath.select(scraping.prova.timeXPath, doc);
    console.log(time[0].nodeValue.trim());
    })
    .catch(error => {
        console.log(error);
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