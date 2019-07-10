const logger = require('loglevel');
const retrievalInfoOnCache = require('./showStrainInfoOnCache');
const retrievalInfoOnFly = require('./showStrainInfoOnFly');
const nameParser = require('../utils/strainNameParser');

async function loadStrainInfo(req, res)
{
    let type = req.query.type;
    let strain = nameParser.parseName(req.query.strain);
    result = await Promise.all([
        retrievalInfoOnCache.getStrainInfo(type, strain),
        retrievalInfoOnFly.getInfoOnFly(type, strain)
    ]);
    logger.info(result);
    result[1].forEach(element => {
        for (prop in element)
        {
            result[0][prop] = element[prop];
        }
    });
    logger.info(result[0]);

    //Rendering here, with var result[0]
}

module.exports.loadStrinInfo = loadStrainInfo;

// loadStrainInfo({query: {type: 'hybrid', strain: 'AK-47'}});