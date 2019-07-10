const logger = require('loglevel');
const connection = require('../db/connection');

logger.setLevel('info', false);

async function loadStrainsType(req, res)
{
    // Testing
    // connection.createInitialConnection();
    // await sleep(1200);

    let strains = [];
    let type = req.query.type;
    let query = {
        type: type
    };
    let projection = {
        projection: {
            _id: 0,
            name: 1, 
            type: 1
        }
    }
    connection.getDatabase().collection('strains').find(query, projection, async (error, cursor) => {
        if (error)
        {
            logger.error(error);
        }
        else
        {
            await cursor.forEach(doc => {
                logger.info(doc);
                strains.push(doc);
            });
            sendResponse(strains, res);
        }
    });
}

function sendResponse(result, res)
{
    logger.info(result);
    res.json(result)
}

module.exports.loadStrainsType = loadStrainsType;

//  Testing
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// loadStrainsType({query: {type: "indica"}}, null);