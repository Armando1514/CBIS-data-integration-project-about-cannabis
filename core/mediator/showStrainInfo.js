const logger = require('loglevel');
const retrievalInfoOnCache = require('./showStrainInfoOnCache');
const retrievalInfoOnFly = require('./showStrainInfoOnFly');
const nameParser = require('../utils/strainNameParser');
const merge = require('merge-deep');

async function loadStrainInfo(req, res) {
    let type = req.params.type;
    let strain = nameParser.parseName(req.params.name);
    Promise.all([
        retrievalInfoOnCache.getStrainInfo(type, strain),
        retrievalInfoOnFly.getInfoOnFly(type, strain)
    ]).then(result => {
        // i need at least the info about the strain

        if (result[0] != null) {
            result = merge(result[0], result[1]);
            console.log("risultato UNO " + JSON.stringify(result));

            res.render("single-strain.ejs", {
                strainInfo: result
            });
        } else {

            logger.info("no valori per tipo:" + type + "e seme: " + strain);
            res.redirect('cbis/public/404.html');


        }
    }).catch(err => {
        console.log(err);

    });
}

module.exports.loadStrinInfo = loadStrainInfo;

// loadStrainInfo({query: {type: 'hybrid', strain: 'AK-47'}});