const worldwideScraper = require('../scrapers/worldwideMarijuanaSeedsScraper');
const leaflyScraper = require('../scrapers/leaflyScraper');
const youtubeWrapper = require('../api/youtubeApiWrapper');

async function getInfoOnFly(type, strain) {
    return await Promise.all([
        worldwideScraper.getInformationAboutStrainFromWorldWideMarijuanaSeedsScraper(strain),
        leaflyScraper.getReviewsFromLeafly(type, strain),
        youtubeWrapper.getStrainVideo(strain)
    ]);


}

module.exports.getInfoOnFly = getInfoOnFly;

// getInfoOnFly('hybrid', 'ak-47');