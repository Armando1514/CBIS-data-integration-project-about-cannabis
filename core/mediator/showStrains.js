const logger = require('loglevel');
const connection = require('../db/connection');
const http = require("http");
const url = require('url');
const strainsForPage = 32;
// logger.setLevel('info', false);


async function getHomeInformation(req, res) {

    Promise.all(
        [countElementsByType("sativa"),
            countElementsByType("indica"),
            countElementsByType("hybrid"),
            countTotalElements(),
            get6RandomElements()
        ]
    ).then((results) => {

        res.render("index.ejs", {
            elements: results
        });
    });
}


async function get6RandomElements() {
    return new Promise((resolve) => {
        connection.getDatabase().collection('strains').aggregate(
            [{
                $sample: {
                    size: 6
                }
            }]
        ).toArray(async function (error, cursor) {
            let results = [];

            await cursor.forEach(doc => {
                results.push(doc);
            });

            resolve(results);
        });
    });

}

async function countElementsByType(typeName) {
    let query = {
        type: typeName
    };

    return connection.getDatabase().collection('strains').find(query).count();
}

async function countTotalElements() {
    return connection.getDatabase().collection('strains').countDocuments();
}


async function searchStrains(req, res) {
    let name = req.query.strain;
    let query = {
        '$text': {
            '$search': name
        }
    };

    let results = [];

    await connection.getDatabase().collection('strains').find(query).toArray(async function (error, cursor) {

        await cursor.forEach(doc => {
            results.push(doc);
        });

        res.render("strainsFound.ejs", {
            strains: results
        });
    });


}


async function loadStrainsType(req, res) {
    let type = req.params.type;

    if (type !== "indica" && type !== "sativa" && type !== "hybrid")
        res.redirect('cbis/public/404.html');


    let query = {
        type: type
    };

    // Testing
    // connection.createInitialConnection();
    // await sleep(1700);


    // Testing
    // connection.createInitialConnection();
    // await sleep(1700);
    connection.getDatabase().collection('strains').find(query).count().then(pageCount => {
        let strains = [];
        let pageNumber;
        let pageRequested = req.params.pageNumber;

        pageCount = pageCount / strainsForPage;

        if ((pageCount % strainsForPage) !== 0) {
            pageCount++;
            pageCount = parseInt(pageCount);
        }

        switch (true) {
            case NaN:
                pageRequested = 1;
                break;
            case pageCount < pageRequested:
                pageRequested = pageCount;
                pageNumber = (pageRequested - 1) * strainsForPage;
                break;
            case pageRequested <= 0:
                pageRequested = 1;
                break;
        }

        pageNumber = (pageRequested - 1) * strainsForPage;


        let projection = {
            projection: {
                _id: 0,
                name: 1,
                type: 1,
                image: 1
            }
        };

        connection.getDatabase().collection('strains').find(query, projection).skip(pageNumber).limit(strainsForPage).toArray(async function (error, cursor) {
            if (error) {
                logger.error(error);
            } else {
                let ctr = 0;
                await cursor.forEach(doc => {

                    //if the image return 404, is not valid, we need to change the url.
                    detect404Image(doc.image).then(value => {
                        if (value === false)
                            doc.image = "/cbis/public/images/side-image.jpg";

                        strains.push(doc);
                        ctr++;
                        if (ctr === cursor.length) {
                            renderStrains(res, strains, type, pageRequested, pageCount);
                        }

                    }).catch(err => {
                        logger.error(err);
                    });

                });

            }
        });
    });
}

function renderStrains(res, strains, type, actualPageNumber, pageCount) {


    if (type === "indica")
        res.render("indica.ejs", {
            strains: strains,
            actualPageNumber: actualPageNumber,
            pageCount: pageCount
        });
    else if (type === "sativa")
        res.render("sativa.ejs", {
            strains: strains,
            actualPageNumber: actualPageNumber,
            pageCount: pageCount
        });
    else if (type === "hybrid")
        res.render("hybrid.ejs", {
            strains: strains,
            actualPageNumber: actualPageNumber,
            pageCount: pageCount
        });
    else
        res.redirect('cbis/public/404.html');


}

function detect404Image(imageUrl) {
    return new Promise((resolve) => {
        imageUrl = encodeURI(imageUrl);
        let options = {
                method: 'HEAD',
                host: url.parse(imageUrl).host,
                port: 80,
                path: url.parse(imageUrl).path
            },
            req = http.request(options, function (r) {
                if (r.statusCode === 404)
                    resolve(false);
                resolve(true);

            });
        req.end();

    });
}

// function sendResponse(result, res)
// {
//     logger.info(result);
//     res.json(result)
// }
module.exports.getHomeInformations = getHomeInformation;
module.exports.searchStrains = searchStrains;

module.exports.loadStrainsType = loadStrainsType;


// Testing
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// loadStrainsType({query: {type: "indica"}}, null);