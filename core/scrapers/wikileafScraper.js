const scraping = require('../../config/scraping');
const axios = require('axios');
const cheerio = require('cheerio');

// logger.setLevel('info', false);

async function getTimeOfUse($) {
    let timeOfUse = $(scraping.wikileaf.timeOfUse.timeOfUseCSSPath).text();
    let obj = {};
    obj["time of use"] = timeOfUse;
    return obj;
}

async function getSmallPicture($) {
    let obj = {};
    obj["small picture"] = $("meta[name='twitter:image']").attr("content");
    console.log(obj);
    return obj;
}


// async function getSimilarStrains($)
// {
//     let similarStrains = [];
//     let namesNodes = $(scraping.wikileaf.similarStrains.container.containerCSSPath).filter(function(i, elem){
//         return $(this).find(scraping.wikileaf.similarStrains.container.containerTitleCSSPath).text() === scraping.wikileaf.similarStrains.container.searchedTitle;
//     }).find(scraping.wikileaf.similarStrains.names.namesCSSPath);
//     logger.info("Similar strains:");
//     namesNodes.each(function(i, elem){
//         logger.info($(this).text());
//         similarStrains.push($(this).text());
//     });
//     return similarStrains;
// }

async function getInformationAboutStrainFromWikiLeafScraper(strain) {
    try {
        let response = await axios.get(scraping.wikileaf.baseURL + strain);
        let html = response.data;
        let $ = cheerio.load(html);
        return await Promise.all([
            getTimeOfUse($),
            getSmallPicture($),
        ]);


    } catch (error) {
        let obj = [];
        obj.push({
            'time of use': null
        });
        obj.push({
            'small picture': null
        });
        return obj;
    }
}

module.exports.getInformationAboutStrainFromWikiLeafScraper = getInformationAboutStrainFromWikiLeafScraper;