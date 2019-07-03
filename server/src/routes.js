const CountriesController = require('./controllers/CountriesController')
const TripsController = require('./controllers/TripsController')
module.exports = (app) => {
  app.get('/countries',
    CountriesController.index)
  app.post('/countries',
    CountriesController.post)
  app.delete('/countries/:countryID',
    CountriesController.delete)

  app.get('/trips',
    TripsController.index)
  app.post('/trips',
    TripsController.post)
  app.delete('/trips/:tripID',
    TripsController.delete)
}
