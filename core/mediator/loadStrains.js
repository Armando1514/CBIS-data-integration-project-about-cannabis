const logger = require('loglevel');
const wikipediaScraper = require('../scrapers/wikipediaScraper');
const iLoveGrowingMarijuanaScraper = require('../scrapers/iLoveGrowingMarijuanaScraper');
const nameParser = require('../utils/strainNameParser');

// logger.setLevel('info', false);

async function getStrains()
{
    try
    {
        let strains = await wikipediaScraper.getStrainsFromWikipedia();
        let strainsWithImage = [];

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
            let typeStrainsWithImage = []
            for (let j = 0; j < typeStrains.length; j++)
            {
                let parsedStrainName = nameParser.parseName(typeStrains[j].name)
                let image = await iLoveGrowingMarijuanaScraper.getImageFromILoveGrowingMarijuana(parsedStrainName);
                if (image != null)
                {
                    typeStrains[j]['image'] = image;
                    typeStrainsWithImage.push(typeStrains[j]);
                }
            }
            strainsWithImage.push(typeStrainsWithImage);
        }));
        logger.info(strainsWithImage);
        logger.info("Number of strains with image: " + (strainsWithImage[0].length + strainsWithImage[1].length + strainsWithImage[2].length));
        return strainsWithImage;
    }
    catch (error)
    {
        logger.error(error);
        return undefined;
    }
}

module.exports.getStrains = getStrains;

// Testing
getStrains();