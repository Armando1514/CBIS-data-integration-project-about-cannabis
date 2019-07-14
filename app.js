const express = require('express');
const logger = require('loglevel');
const config = require('./config/essential');
const showStrains = require('./core/mediator/showStrains');
const showStrainInfo = require('./core/mediator/showStrainInfo');
const connection = require('./core/db/connection');

const app = express();

app.enable('strict routing');

logger.setLevel('info', false);

connection.createInitialConnection();


app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: false
}));

app.use(config.basepath + "/public", express.static('public'));


app.get(config.basepath + "/searchStrain", showStrains.searchStrains);

app.get([config.basepath + "/", config.basepath + "/index.html", config.basepath + "/index.html/", config.basepath + "/index", config.basepath + "/index/", config.basepath + "/home", config.basepath + "/home/"], showStrains.getHomeInformations);

app.get([config.basepath + "/:type", config.basepath + "/:type/", config.basepath + "/:type/showPage/:pageNumber", config.basepath + "/:type/showPage/:pageNumber/"], showStrains.loadStrainsType);


app.get([config.basepath + '/:type/single-strain/:name', config.basepath + '/:type/single-strain/:name/'], showStrainInfo.loadStrinInfo);


//The 404 Route (ALWAYS Keep this as the last route)
app.all('*', function (req, res) {
    res.redirect(config.basepath + '/public/404.html');
});



app.listen(config.port, config.host, () => logger.info('[System] App cbis has been deployed at: http://' + config.host + ':' + config.port + config.basepath));