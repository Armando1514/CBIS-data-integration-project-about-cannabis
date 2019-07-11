const logger = require('loglevel');
const worldwideScraper = require('../scrapers/worldwideMarijuanaSeedsScraper');
const leaflyScraper = require('../scrapers/leaflyScraper');
const youtubeWrapper = require('../api/youtubeApiWrapper');

async function getInfoOnFly(type, strain)
{
    let result = await Promise.all([
        worldwideScraper.getInformationAboutStrainFromWorldWideMarijuanaSeedsScraper(strain),
        leaflyScraper.getReviewsFromLeafly(type, strain),
        youtubeWrapper.getStrainVideo(strain)
    ]);
    if (result["price"] != null || result["reviews"] != null || result["video"] != null) {
        console.log("dasdasda" + result["reviews"]);
        return result;
    }

    return null;

}

module.exports.getInfoOnFly = getInfoOnFly;

// getInfoOnFly('hybrid', 'ak-47');