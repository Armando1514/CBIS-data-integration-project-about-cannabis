const logger = require('loglevel');
const scraping = require('../../config/scraping');
const axios = require('axios');
const cheerio = require('cheerio');

logger.setLevel('info', false);

/*async*/ function getTimeOfUse($)
{
    let timeOfUse = $(scraping.wikileaf.timeOfUse.timeOfUseCSSPath).text();
    logger.info("Time of use: " + timeOfUse);
    return timeOfUse;
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

async function getInfo(strain)
{
    try
    {
        let response = await axios.get(scraping.wikileaf.baseURL + strain);
        let html = response.data;
        let $ = cheerio.load(html);
        let timeOfUse = getTimeOfUse($); 
        return timeOfUse;
        // let result = await Promise.all([
        //     getTimeOfUse($),
        //     // getSimilarStrains($)
        // ]);
        // let resultObj = {};
        // resultObj['timeOfUse'] = result[0];
        // resultObj['similarStrains'] = result[1];
        // logger.info(result[0]);
        // return result[0];
    }
    catch (error) //When occours an error or when the strain page is not founded on wikileaf
    {
        logger.error(error);
        return undefined;
    }
}

// Testing
getInfo('sour-og');