import mongoose from 'mongoose'
import 'date-fns/sub'

import Measurement from '../models/measurement.js'

const measurementController = {}

measurementController.index = async (req, res) => {
  try {
    const now = Date.now()
    let start = sub(now, { weeks: 1})

    if (req.query.start) {
      start = req.query.start
    }

    const measurements = await Measurement.find({
      timestamp: {
        $gte: start
      }})

      res.json(measurements)
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.add = async (req, res) => {
  try {
    const measurement = new Measurement({...req.body})
    const saved = await measurement.save()

    res.json(saved)
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

export default measurementController