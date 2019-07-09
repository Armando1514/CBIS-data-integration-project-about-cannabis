const logger = require('loglevel');
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config/db');

logger.setLevel('info', false);

var db;

const options = {
    poolSize: 10,
    useNewUrlParser: true
};

const url = 'mongodb://' + config.host + ':' + config.port;

module.exports.createInitialConnection = function() {
    MongoClient.connect(url, options, function(error, database) {
        if(error)
        {
            logger.error('Connection to database refused!'); 
            logger.error(error);
        }
        else
        {
            db = database.db(config.dbName);
            logger.info('Initial connection has been created!');
        }
    });
}

module.exports.getDatabase = function () {
    return db;
};