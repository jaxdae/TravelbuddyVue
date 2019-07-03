const {Trip} = require('../models')

module.exports = {
  async index (req, res) {
    try {
        const trips = await Trip.findAll({
        
        })
      res.send(trips)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the trips'
      })
    }
  },
  async post (req, res) {
    try {
      const trip = await Trip.create(req.body)
      res.send(trip)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the trip'
      })
    }
  },
  async delete (req, res) {
    try {
      const {tripID} = req.params
      const toDelete = await Trip.findOne({
        where: {
          id: tripID
        }
      })
      await toDelete.destroy()
      res.send(toDelete)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to delete the trip'
      })
    }
  }
}