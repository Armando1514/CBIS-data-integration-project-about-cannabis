const logger = require('loglevel');
const retrievalInfoOnCache = require('./showStrainInfoOnCache');
const retrievalInfoOnFly = require('./showStrainInfoOnFly');
const nameParser = require('../utils/strainNameParser');
const merge = require('merge-deep');

async function loadStrainInfo(req, res)
{
    let type = req.params.type;
    let strain = nameParser.parseName(req.params.name);
    Promise.all([
        retrievalInfoOnCache.getStrainInfo(type, strain),
        retrievalInfoOnFly.getInfoOnFly(type, strain)
    ]).then(result => {
        // i need at least the info about the strain
        console.log("valori" + result[0] + result[1]);
        if (result[0] != null) {
            console.log("valore 1" + result[0][0][0]['origin']);
            result = merge(result);
            res.render("index.ejs", {strainInfo: result});
        } else {
            console.log("no valori");

            //error page
            res.render("strain.ejs", {strainInfo: result});

        }
    }).catch(err => {
        console.log(err);

    });
}

module.exports.loadStrinInfo = loadStrainInfo;

// loadStrainInfo({query: {type: 'hybrid', strain: 'AK-47'}});