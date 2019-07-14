const logger = require('loglevel');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/db');
const loader = require('../core/mediator/loadStrains');

const options = {
    poolSize: 1,
    useNewUrlParser: true
};

const url = 'mongodb://' + config.host + ':' + config.port;

logger.setLevel('info', false);

async function populatStrainsCollection(collection) {
    let strains = await loader.getStrains();
    // for (let i = 0; i < strains.length; i++)
    // {
    //     try
    //     {
    //         await collection.insertMany(strains[i]);
    //         logger.info('Documents have been inserted');
    //     }
    //     catch (error)
    //     {
    //         logger.error(error);
    //     }
    // }
    await Promise.all(strains.map(async (typeStrains) => {
        try {
            await collection.insertMany(typeStrains);
            logger.info('Documents have been inserted');
        } catch (error) {
            logger.error(error);
        }
    }));
}

async function createStrainCollectionIndex(collection) {
    try {
        await collection.createIndex({
            type: 1
        }, {
            name: 'typesIndex'
        });
        logger.info('typeIndex has been created');
        await connection.getDatabase().collection('strains').createIndex({
            name: "text"
        });
        logger.info('name_text index has been created');

    } catch (error) {
        logger.error(error);
    }
}

async function createStrainsCollection(db) {
    try {
        let collection = await db.createCollection('strains');
        logger.info('strains has been created');
        await Promise.all([
            createStrainCollectionIndex(collection),
            populatStrainsCollection(collection)
        ]);
    } catch (error) {
        logger.error(error);
    }
}

async function createStrainsInfoCollection(db) {
    try {
        let collection = await db.createCollection('strainsInfoCache');
        logger.info('strainsInfoCache has been created');
        await collection.createIndex({
            name: 1
        }, {
            name: 'namesIndex'
        });
        logger.info('namesIndex has been created');
    } catch (error) {
        logger.error(error);
    }
}

async function initDatabase() {
    try {
        let database = await MongoClient.connect(url, options);
        logger.info('Connection has been created');
        db = database.db(config.dbName);
        await Promise.all([
            createStrainsCollection(db),
            createStrainsInfoCollection(db)
        ]);
        logger.info('Init has been completed!');
    } catch (error) {
        logger.error('Connection refused!');
        logger.error(error);
    }
}

initDatabase();