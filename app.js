const express = require('express')
const logger = require('loglevel')
const config = require('./config/essential')
const basicRoutes = require('./core/basicRoutes')
// const ratingAnalyzerQuery = require('./core/query/ratingAnalyzerQuery')
// const rentCountQuery = require('./core/query/rentCountQuery')
// const squareMetresClassesQuery = require('./core/query/squareMetresClassesQuery')
// const ratingClassesQuery = require('./core/query/ratingClassesQuery')
// const amenityAndPropertyQuery = require('./core/query/amenityAndPropertyQuery')

const app = express()

logger.setLevel('INFO', false)

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get(config.basepath, basicRoutes.functionHomePage)
// app.get(config.basepath + '/' + 'rentCount', basicRoutes.functionRentCount)
// app.post(config.basepath + '/' + 'rentCountQuery', rentCountQuery)

// app.get(config.basepath + '/' + 'amenityAndProperty', basicRoutes.functionAmenityAndProperty)
// app.post(config.basepath + '/' + 'amenityAndPropertyQuery', amenityAndPropertyQuery)

// app.get(config.basepath + '/' + 'ratingAnalyzer', basicRoutes.functionRatingAnalyzer)
// app.post(config.basepath + '/' + 'ratingAnalyzerQuery', ratingAnalyzerQuery)

// app.get(config.basepath + '/' + 'ratingClasses', basicRoutes.functionRatingClasses)
// app.post(config.basepath + '/' + 'ratingClassesQuery', ratingClassesQuery)

// app.get(config.basepath + '/' + 'squareMetresClasses', basicRoutes.functionSquareMetresClasses)
// app.post(config.basepath + '/' + 'squareMetresClassesQuery', squareMetresClassesQuery)

// app.get(config.basepath + '/' + 'about', basicRoutes.functionAboutPage)

app.listen(config.port, config.host, () => logger.info('[System] App cbis has been deployed at: http://' + config.host + ':' + config.port + config.basepath))