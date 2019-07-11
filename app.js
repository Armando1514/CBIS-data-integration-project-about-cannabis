const express = require('express');
const logger = require('loglevel');
const config = require('./config/essential');
const showStrains = require('./core/mediator/showStrains');
const showStrainInfo = require('./core/mediator/showStrainInfo');
const connection = require('./core/db/connection');

const app = express();

logger.setLevel('info', false);

connection.createInitialConnection();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get(config.basepath + '/:type/:name', showStrainInfo.loadStrinInfo);

app.listen(config.port, config.host, () => logger.info('[System] App cbis has been deployed at: http://' + config.host + ':' + config.port + config.basepath));