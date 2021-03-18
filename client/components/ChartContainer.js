import fromUnixTime from 'date-fns/fromUnixTime'
import formatISO from 'date-fns/formatISO'

import LightChart from 'components/LightChart'

const ChartContainer = ({measurements}) => {
  const formatted = measurements.map((
    { timestamp, ...rest }) => ({ timestamp: formatISO(fromUnixTime(timestamp)), ...rest}
    ))

  const light = [{
    id: 'light',
    data: formatted.map(({ timestamp, lux }) => {

     lux = lux < 1 ? 0.01 : lux

      return {
        x: timestamp,
        y: lux
      }
    })
  }]

  const humid = [{
    id: 'humidity',
    data: formatted.map(({ timestamp, humidity }) => ({ x: timestamp, y: humidity }))
  }]

  const temp = [{
    id: 'temperature',
    data: formatted.map(({ timestamp, temperature }) => ({ x: timestamp, y: temperature }))
  }]

  const soil = [{
    id: 'soil',
    data: formatted.map(({ timestamp, soilMoisture }) => ({ x: timestamp, y: soilMoisture }))
  }]

  return (
    <div className="grid gap-4 lg:gap-8 place-items-center items-center content-center justify-center min-h-full mt-4 grid-cols-1 lg:grid-cols-2">
      <LightChart data={light} />
      <LightChart data={light} />
      <LightChart data={light} />
      <LightChart data={light} />
    </div>
  )
}

export default ChartContainer