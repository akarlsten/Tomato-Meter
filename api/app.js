import express from 'express'
import 'dotenv/config.js'

import connectToDB from './db/mongoose.js'
import authenticate from './middleware/auth.js'

import measurementController from './controllers/measurement.js'

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

connectToDB().catch(error => {
  console.error(error)
  process.exit(1)
})

app.get('/', measurementController.index)
app.get('/status', measurementController.latest)
app.get('/temperature', measurementController.temperature)
app.get('/humidity', measurementController.humidity)
app.get('/soil', measurementController.soilMoisture)
app.get('/light', measurementController.lightLevel)
app.get('/thing', measurementController.thing)
app.post('/', authenticate, measurementController.add)

app.listen(port, () => {
  console.log(`Server started on port ${port}!`)
})

export { app }
