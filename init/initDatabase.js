const logger = require('loglevel');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/db');
const scraper = require('../core/scrapers/wikipediaScraper');

const options = {
    poolSize: 1,
    useNewUrlParser: true
};

const url = 'mongodb://' + config.host + ':' + config.port;

logger.setLevel('info', false);

async function populateStrainsCollection(db)
{
    let strains = await scraper.getStrains();
    db.createCollection('strains', function(error, collection){
        if (!error)
        {
            logger.info('strains has been created');
            collection.createIndex({type: 1}, {name: 'typesIndex'}, function(error, result){
                if(!error)
                {
                    logger.info('typesIndex has been created');
                }
            });
            strains.forEach(typeStrains => {
                collection.insertMany(typeStrains, function(){
                    logger.info('Documents have been inserted');  
                });
            });
        }
        else
        {
            logger.error(error);
        }
    })
}

async function createStrainsInfoCollection(db)
{
    db.createCollection('strainsInfoCache', function(error, collection){
        if (!error)
        {
            logger.info('strainsInfoCache has been created');
            collection.createIndex({name: 1}, {name: 'namesIndex'}, function(error, result){
                if(!error)
                {
                    logger.info('namesIndex has been created');
                }
            });
        }
        else
        {
            logger.error(error);
        }
    })
}

async function initDatabase()
{
    MongoClient.connect(url, options, async function(error, database) {
        if(error)
        {
            logger.error('Connection refused!'); 
            logger.error(error);
        }
        else
        {
            logger.info('Connection has been created');
            db = database.db(config.dbName);
            await Promise.all([
                populateStrainsCollection(db),
                createStrainsInfoCollection(db)
            ]);
        }
    });
}

initDatabase();