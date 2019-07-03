const {Country} = require('../models')

module.exports = {
  async index (req, res) {
    try {
        const countries = await Country.findAll({
        
        })
      res.send(countries)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the countries'
      })
    }
  },
  async post (req, res) {
    try {
      const country = await Country.create(req.body)
      res.send(country)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the country'
      })
    }
  },
  async delete (req, res) {
    try {
      const {countryID} = req.params
      const toDelete = await Country.findOne({
        where: {
          id: countryID
        }
      })
      await toDelete.destroy()
      res.send(toDelete)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to delete the country'
      })
    }
  }
}