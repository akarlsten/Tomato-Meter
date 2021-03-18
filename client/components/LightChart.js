import { ResponsiveLine } from '@nivo/line'
import format from 'date-fns/format'

const CustomEmojiTick = ({tick, direction}) => {
  let emoji = ''

  switch(tick.value) {
    case 0:
      emoji = '🌑'
      break
    case 3000:
      emoji = '☁️'
      break
    case 5000:
      emoji = '⛅'
      break
    case 10000:
      emoji = '🌤️'
      break
    case 100000:
      emoji = '🌞'
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

const CustomSlice = ({slice}) => {
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
          <p style={{ fontFamily: 'Inconsolata'}} className="pt-2 border-t border-gray-800">🌞: <span className='-ml-2 font-semibold text-sm'>{point.data.yFormatted}</span></p>
        </div>
      ))}
    </div>
  )
}

const LightChart = ({data}) => {
  console.log(data)

  return (
    <div className="rounded-lg bg-white p-3 h-64 w-64 md:h-96 md:w-96 lg:h-120 lg:w-132">
      <p className="font-bold text-center -mb-3">Sunlight (Lux)</p>
      <ResponsiveLine
        data={data}
        curve="basis"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: 'time', format: "%Y-%m-%dT%H:%M:%S%Z", useUTC: false}}
        xFormat="time:%Y-%m-%dT%H:%M:%S%Z"
        axisLeft={{
          tickValues: [0, 3000, 5000, 10000, 100000],
          tickSize: 10,
          renderTick: LeftTick
        }}
        axisRight={{
          tickValues: [0, 3000, 5000, 10000, 100000],
          renderTick: RightTick,
        }}
        axisBottom={{
          tickValues: "every 6 hours",
          tickSize: 2,
          tickPadding: 5,
          tickRotation: 15,
          format: "%a %b %d %H:%M",
        }}
        yScale={{ type: 'symlog', constant: 10000, max: "100000", stacked: false, reverse: false }}
        lineWidth="2"
        gridYValues={[0, 3000, 5000, 10000, 100000]}
        enableArea={true}
        enableSlices="x"
        enablePoints={false}
        colors={['#FBBF24']}
        sliceTooltip={CustomSlice}
      />
    </div>
  )

}

export default LightChart