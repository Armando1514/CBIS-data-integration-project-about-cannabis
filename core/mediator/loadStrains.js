const logger = require('loglevel');
const wikipediaScraper = require('../scrapers/wikipediaScraper');
const iLoveGrowingMarijuanaScraper = require('../scrapers/iLoveGrowingMarijuanaScraper');
const nameParser = require('../utils/strainNameParser');

logger.setLevel('info', false);

async function getStrains()
{
    try
    {
        let strains = await wikipediaScraper.getStrainsFromWikipedia();

        // Too fast, Axios crashs
        // for (let i = 0; i < strains.length; i++)
        // {
        //     await Promise.all(strains[i].map(async (strain) => {
        //         try
        //         {
        //             let parsedStrainName = nameParser.parseName(strain.name)
        //             let image = await iLoveGrowingMarijuanaScraper.getImageFromILoveGrowingMarijuana(parsedStrainName);
        //             strain['image'] = image;
        //         }
        //         catch (error)
        //         {
        //             logger.error(error);
        //         }
        //     }));
        //     // for (let j = 0; j < strains[i].length; j++)
        //     // {
        //     //     let parsedStrainName = nameParser.parseName(strains[i][j].name)
        //     //     let image = await iLoveGrowingMarijuanaScraper.getImageFromILoveGrowingMarijuana(parsedStrainName);
        //     //     strains[i][j]['image'] = image;
        //     // }
        // }

        await Promise.all(strains.map(async (typeStrains) => {
            for (let j = 0; j < typeStrains.length; j++)
            {
                let parsedStrainName = nameParser.parseName(typeStrains[j].name)
                let image = await iLoveGrowingMarijuanaScraper.getImageFromILoveGrowingMarijuana(parsedStrainName);
                typeStrains[j]['image'] = image;
            }
        }));
        // logger.info(strains);
        return strains;
    }
    catch (error)
    {
        logger.error(error);
        return undefined;
    }
}

module.exports.getStrains = getStrains;

// Testing
// getStrains();