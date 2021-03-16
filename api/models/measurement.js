import mongoose from 'mongoose'

const Measurement = mongoose.model('Measurement', {
  timestamp: {
    type: Number
  },
  lux: {
    type: Number
  },
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  soilMoisture: {
    type: Number
  }
})

export default Measurement