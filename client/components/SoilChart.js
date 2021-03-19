import { ResponsiveLine } from '@nivo/line'
import { patternLinesDef, linearGradientDef } from '@nivo/core'
import format from 'date-fns/format'

const CustomEmojiTick = ({ tick, direction }) => {
  let emoji = ''

  switch (tick.value) {
    case 1000:
      emoji = '🏜️'
      break
    case 1200:
      emoji = '💀'
      break
    case 1300:
      emoji = '😣'
      break
    case 1400:
      emoji = '😟'
      break
    case 1500:
      emoji = '🤔'
      break
    case 1600:
      emoji = '🙂'
      break
    case 1700:
      emoji = '😃'
      break
    case 1800:
      emoji = '😁'
      break
    case 1900:
      emoji = '🌊'
      break
  }

  const offset = direction === 'left' ? -15 : 15

  return (
    <g transform={`translate(${tick.x + offset},${tick.y})`}>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: 20,
        }}
      >
        {emoji}
      </text>
    </g>
  )
}

const LeftTick = (tick) => (<CustomEmojiTick tick={tick} direction={'left'} />)
const RightTick = (tick) => (<CustomEmojiTick tick={tick} direction={'right'} />)

const CustomSlice = ({ slice }) => {
  return (
    <div
      className="flex border border-gray-800 rounded-sm"
      style={{
        background: 'white',
        padding: '9px 9px',
      }}
    >
      {slice.points.map(point => (
        <div
          key={point.id}
          style={{
            padding: '3px 0',
          }}
        >
          <p className="text-sm font-semibold">{format(point.data.x, "do LLL")}</p>
          <p className="text-sm font-light">{format(point.data.x, "HH:mm")}</p>
          <p style={{ fontFamily: 'Inconsolata' }} className="pt-2 border-t border-gray-800">🌊: <span className='-ml-2 font-semibold text-sm'>{point.data.yFormatted}</span></p>
        </div>
      ))}
    </div>
  )
}

const SoilChart = ({ data, timeSpan }) => {

  const tickValues = timeSpan === '7d' ? 'every 24 hours' : timeSpan === '24h' ? 'every 3 hours' : 'every 1 hour'
  const formatting = timeSpan === '7d' ? "%a %dth" : timeSpan === '24h' ? "%a %dth %H:%M" : "%H:%M"

  return (
    <div className="rounded-lg shadow-inner bg-white pb-4 h-96 w-80 sm:w-96 sm:h-96 md:h-96 md:w-86 lg:w-108 lg:h-108 xl:h-120 xl:w-132">
      <p className="font-bold text-2xl text-center -mb-10 mt-2 underline">Soil Moisture</p>
      <ResponsiveLine
        data={data}
        curve="basis"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: 'time', format: "%Y-%m-%dT%H:%M:%S%Z", useUTC: false }}
        xFormat="time:%Y-%m-%dT%H:%M:%S%Z"
        axisLeft={{
          tickValues: [1000, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900],
          tickSize: 2
        }}
        axisRight={{
          tickValues: [1000, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900],
          renderTick: RightTick,
        }}
        axisBottom={{
          tickValues: tickValues,
          tickSize: 2,
          tickPadding: 5,
          tickRotation: 25,
          format: formatting,
        }}
        yScale={{ type: 'linear', min: "1000", max: "2000", stacked: false, reverse: false }}
        lineWidth="2"
        gridYValues={[1000, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]}
        enableSlices="x"
        enablePoints={false}
        enableArea={true}
        areaOpacity={1}
        theme={{ fontFamily: 'Inconsolata', fontSize: 13, fontWeight: 'bold', grid: { line: { stroke: '#FECACA' } } }}
        colors={['#3B82F6']}
        defs={[
         linearGradientDef('gradientA', [
            { offset: 0, color: 'inherit' },
            { offset: 40, color: 'inherit', opacity: 0 },
          ]),
        ]}
        fill={[{match: '*', id: 'gradientA'}]}
        sliceTooltip={CustomSlice}
      />
    </div>
  )

}

export default SoilChart