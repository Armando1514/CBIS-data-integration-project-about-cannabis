const scraping = require('../../config/scraping');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

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