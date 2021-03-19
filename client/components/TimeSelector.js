const TimeSelector = ({timeSpan, setTimeSpan}) => {
  return (
    <>
    <div className="flex mt-2 font-bold">
    Time Span
    </div>
    <div className="flex font-bold space-x-2 cursor-default">
        <div onClick={() => setTimeSpan('7d')} className={`px-2 py-1 bg-red-300 rounded-lg hover:bg-red-500 hover:text-red-100  ${timeSpan === '7d' && 'bg-red-400 text-white'}`}>7D</div>
        <div onClick={() => setTimeSpan('24h')} className={`px-2 py-1 bg-red-300 rounded-lg hover:bg-red-500 hover:text-red-100 ${timeSpan === '24h' && 'bg-red-400 text-white'}`}>24H</div>
        <div onClick={() => setTimeSpan('6h')} className={`px-2 py-1 bg-red-300 rounded-lg hover:bg-red-500 hover:text-red-100 ${timeSpan === '6h' && 'bg-red-400 text-white'}`}>6H</div>
    </div>
    </>
  )
}

export default TimeSelector