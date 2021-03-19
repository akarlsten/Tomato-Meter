import sub from 'date-fns/sub/index.js'
import getUnixTime from 'date-fns/getUnixTime/index.js'

import Measurement from '../models/measurement.js'

const measurementController = {}

measurementController.index = async (req, res) => {
  try {
    const now = Date.now()
    let start = getUnixTime(sub(now, { weeks: 1 }))

    if (req.query.start) {
      start = req.query.start
    }

    const measurements = await Measurement.find({
      timestamp: {
        $gte: start
      }
    }).sort({ timestamp: 'asc' })

    res.json(measurements)
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.add = async (req, res) => {
  try {
    const measurement = new Measurement({ ...req.body })
    const saved = await measurement.save()

    res.json(saved)
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.latest = async (req, res) => {
  try {
    const measurement = await Measurement.find({}).sort({ _id: -1 }).limit(1)

    res.json(measurement)
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.temperature = async (req, res) => {
  try {
    const { timestamp, temperature } = await Measurement.find({}).sort({ _id: -1 }).limit(1)

    res.json({ timestamp, temperature })
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.humidity = async (req, res) => {
  try {
    const { timestamp, humidity } = await Measurement.find({}).sort({ _id: -1 }).limit(1)

    res.json({ timestamp, humidity })
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.soilMoisture = async (req, res) => {
  try {
    const { timestamp, soilMoisture } = await Measurement.find({}).sort({ _id: -1 }).limit(1)

    res.json({ timestamp, soilMoisture })
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.lightLevel = async (req, res) => {
  try {
    const { timestamp, lux } = await Measurement.find({}).sort({ _id: -1 }).limit(1)

    res.json({ timestamp, lux })
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

measurementController.thing = async (req, res) => {
  try {
    res.set('Content-Type', 'application/td+json')
    res.json({
      '@context': 'https://www.w3.org/2019/wot/td/v1',
      id: 'https://tomato-meter.herokuapp.com',
      title: 'TomatoMeter',
      description: 'A LoPY4 with connected temp/humidity, soil moisture and lux sensors.',
      securityDefinitions: { nosec_sc: { scheme: 'nosec' } },
      security: 'nosec_sc',
      properties: {
        status: {
          type: 'object',
          properties: {
            timestamp: 'integer',
            lux: 'number',
            temperature: 'integer',
            soilMoisture: 'integer',
            humidity: 'integer'
          },
          forms: [{ href: 'https://tomato-meter.herokuapp.com/status' }]
        },
        temperature: {
          type: 'object',
          properties: {
            timestamp: 'integer',
            temperature: 'integer'
          },
          forms: [{ href: 'https://tomato-meter.herokuapp.com/temperature' }]
        },
        humidity: {
          type: 'object',
          properties: {
            timestamp: 'integer',
            humidity: 'integer'
          },
          forms: [{ href: 'https://tomato-meter.herokuapp.com/humidity' }]
        },
        lightLevel: {
          type: 'object',
          properties: {
            timestamp: 'integer',
            lux: 'number'
          },
          forms: [{ href: 'https://tomato-meter.herokuapp.com/light' }]
        },
        soilMoisture: {
          type: 'object',
          properties: {
            timestamp: 'integer',
            soilMoisture: 'integer'
          },
          forms: [{ href: 'https://tomato-meter.herokuapp.com/soil' }]
        }
      }
    })
  } catch (e) {
    res.status(400).send(e.errors)
  }
}

export default measurementController
