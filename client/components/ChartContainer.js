import { useMemo, useState } from 'react'
import fromUnixTime from 'date-fns/fromUnixTime'
import getUnixTime from 'date-fns/getUnixTime'
import formatISO from 'date-fns/formatISO'

import TimeSelector from 'components/TimeSelector'
import LightChart from 'components/LightChart'

const ChartContainer = ({measurements}) => {
  const [timeSpan, setTimeSpan] = useState('7d')


  const formatted = useMemo(() => measurements.filter(({ timestamp }) => {
      const unixTime = getUnixTime(new Date())

      let timeToSubtract 

      switch(timeSpan) {
        case '7d':
          timeToSubtract = 604800 // 7d
          break
        case '24h':
          timeToSubtract = 86400 // 24h
          break
        case '6h':
          timeToSubtract = 21600 // 6h
      }

      const start = unixTime - timeToSubtract

      return start < timestamp
    }).map((
    { timestamp, ...rest }) => ({ timestamp: formatISO(fromUnixTime(timestamp)), ...rest}
    )), [measurements, timeSpan])


  const light = useMemo(() => (
    [{
      id: 'light',
      data: formatted.map(({ timestamp, lux }) => {

        lux = lux < 1 ? 0.01 : lux

        return {
          x: timestamp,
          y: lux
        }
      })
    }]
  ), [formatted]) 

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
    <>
    <TimeSelector timeSpan={timeSpan} setTimeSpan={setTimeSpan} />
    <div className="grid gap-4 lg:gap-8 place-items-center items-center content-center justify-center min-h-full mt-4 grid-cols-1 lg:grid-cols-2">
      <LightChart data={light} />
      <LightChart data={light} />
      <LightChart data={light} />
      <LightChart data={light} />
    </div>
    </>
  )
}

export default ChartContainer