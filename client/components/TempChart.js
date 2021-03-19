import { ResponsiveLine } from '@nivo/line'
import { Defs, linearGradientDef } from '@nivo/core'
import { area } from 'd3-shape'
import format from 'date-fns/format'

const CustomEmojiTick = ({ tick, direction }) => {
  let emoji = ''

  switch (tick.value) {
    case 13:
      emoji = '🥶'
      break
    case 22:
      emoji = '😁'
      break
    case 35:
      emoji = '🥵'
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
          <p style={{ fontFamily: 'Inconsolata' }} className="pt-2 border-t border-gray-800">🌡️: <span className='-ml-2 font-semibold text-sm'>{point.data.yFormatted}°C</span></p>
        </div>
      ))}
    </div>
  )
}

const NiceArea = ({ series, xScale, yScale, innerHeight }) => {
  const areaGenerator = area()
    .x(d => xScale(d.data.x))
    .y0(d => yScale(18.5))
    .y1(d => yScale(26.5))

  return (
    <>
      <Defs
        defs={[
          {
            id: 'pattern',
            type: 'patternLines',
            background: 'transparent',
            color: '#34D399',
            lineWidth: 1,
            spacing: 3,
            rotation: -45,
          },
        ]}
      />
      <path
        d={areaGenerator(series[0].data)}
        fill="url(#pattern)"
        fillOpacity={0.4}
      />
    </>
  )
}

const ColdArea = ({ series, xScale, yScale, innerHeight }) => {
  const areaGenerator = area()
    .x(d => xScale(d.data.x))
    .y0(d => yScale(0))
    .y1(d => yScale(13))

  return (
    <>
      <Defs
        defs={[
          {
            id: 'coldGradient',
            type: 'linearGradient',
            colors: [
              { offset: 0, color: '#60A5FA' },
              { offset: 100, color: '#60A5FA', opacity: 0}
            ]
          },
        ]}
      />
      <path
        d={areaGenerator(series[0].data)}
        fill="url(#coldGradient)"
        fillOpacity={0.2}
      />
    </>
  )
}

const HotArea = ({ series, xScale, yScale, innerHeight }) => {
  const areaGenerator = area()
    .x(d => xScale(d.data.x))
    .y0(d => yScale(35))
    .y1(d => yScale(50))

  return (
    <>
      <Defs
        defs={[
          {
            id: 'hotGradient',
            type: 'linearGradient',
            colors: [
              { offset: 0, color: '#F87171', opacity: 0  },
              { offset: 100, color: '#F87171'}
            ]
          },
        ]}
      />
      <path
        d={areaGenerator(series[0].data)}
        fill="url(#hotGradient)"
        fillOpacity={0.2}
      />
    </>
  )
}

const TempChart = ({ data, timeSpan }) => {

  const tickValues = timeSpan === '7d' ? 'every 24 hours' : timeSpan === '24h' ? 'every 3 hours' : 'every 1 hour'
  const formatting = timeSpan === '7d' ? "%a %dth" : timeSpan === '24h' ? "%a %dth %H:%M" : "%H:%M"

  return (
    <div className="rounded-lg shadow-inner bg-white pb-4 h-96 w-80 sm:w-96 sm:h-96 md:h-96 md:w-86 lg:w-108 lg:h-108 xl:h-120 xl:w-132">
      <p className="font-bold text-2xl text-center -mb-10 mt-2 underline">Temperature</p>
      <ResponsiveLine
        data={data}
        curve="basis"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: 'time', format: "%Y-%m-%dT%H:%M:%S%Z", useUTC: false }}
        xFormat="time:%Y-%m-%dT%H:%M:%S%Z"
        axisLeft={{
          tickValues: [0, 13, 18.5, 26.5, 35, 50],
          tickSize: 2,
        }}
        axisRight={{
          tickValues: [13, 18.5, 22, 26.5, 25, 35],
          renderTick: RightTick,
        }}
        axisBottom={{
          tickValues: tickValues,
          tickSize: 2,
          tickPadding: 5,
          tickRotation: 25,
          format: formatting,
        }}
        yScale={{ type: 'linear', min: "0", max: "50", stacked: false, reverse: false }}
        lineWidth="3"
        gridYValues={[0, 13, 18.5, 26.5, 35, 50]}
        enableSlices="x"
        enablePoints={false}
        enableArea={false}
        areaOpacity={1}
        theme={{ fontFamily: 'Inconsolata', fontSize: 13, fontWeight: 'bold', grid: { line: { stroke: '#FECACA' } } }}
        colors={['#34D399']}
        defs={[
          linearGradientDef('gradientA', [
            { offset: 0, color: '#34D399' },
            { offset: 70, color: 'inherit', opacity: 0 },
          ]),
        ]}
        fill={[{ match: '*', id: 'gradientA' }]}
        sliceTooltip={CustomSlice}
        layers={[
          'grid',
          NiceArea,
          ColdArea,
          HotArea,
          'markers',
          'areas',
          'lines',
          'slices',
          'axes',
          'points',
          'legends',
          'crosshair'
        ]}
      />
    </div>
  )

}

export default TempChart