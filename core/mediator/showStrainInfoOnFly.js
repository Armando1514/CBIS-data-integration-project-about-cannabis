const logger = require('loglevel');
const worldwideScraper = require('../scrapers/worldwideMarijuanaSeedsScraper');
const leaflyScraper = require('../scrapers/leaflyScraper');
const youtubeWrapper = require('../api/youtubeApiWrapper');

async function getInfoOnFly(type, strain)
{
    let result = await Promise.all([
        worldwideScraper.getInformationAboutStrainFromWorldWideMarijuanaSeedsScraper(type),
        youtubeWrapper.getStrainVideo(strain)
    ]);
    console.log(result);
}

getInfoOnFly('hybrid', 'ak-47');