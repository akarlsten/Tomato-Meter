import Head from 'next/head'
import styles from '../styles/Home.module.css'

import ChartContainer from 'components/ChartContainer'

export default function Home({measurements}) {
  return (
    <div className="container mx-auto max-w-7xl bg-red-100 shadow-2xl rounded-xl h-full text-gray-800">
      <Head>
        <title>TomatoMeter</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex flex-col justify-center items-center px-10 pt-10 pb-6">
        <div className="w-full grid justify-items-center gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
          <div className="max-w-md shadow-lg bg-white p-4 rounded-lg">
            <div className="flex content-center justify-center text-2xl font-bold">
              <p className=" mb-2 text-center underline">
                How is my tomato plant doing?
              </p>
              <span className="no-underline">🍅</span>
            </div>
            <p className="text-sm">
              This website will allow you to check up on one of the cherry tomato plants in my windowsill.
              We keep track of the air temperature, humidity, soil moisture and light levels and present it as graphs.
            </p>
          </div>
          <div className="max-w-md shadow-lg bg-white p-4 rounded-lg">
            <div className="flex content-center justify-center text-2xl font-bold">
              <p className=" mb-2 text-center underline">
                Project Description
              </p>
              <span className="no-underline">🏗️</span>
            </div>
            <p className="text-sm">
              The project is backed by a LoPy4 microcontroller using a DHT11 temp/humidity sensor, a TSL2591 light sensor and a VMA303 soil moisture sensor.
              The data is gathered every 30 minutes and is then POSTed to a REST api where it is stored in a database. This frontend site queries that API.
            </p>
          </div>
        </div>
        <ChartContainer measurements={measurements} />
      </main>

      <footer className="flex items-center align-middle justify-center pb-6">
        <div className="flex items-center text-center p-2 rounded-lg">
          <span className="font-semibold text-lg text-gray-700">
            🍅<a rel="noopener noreferrer" target="_blank" href="https://adamkarlsten.com"><span className="shadow-md p-2 mx-1 bg-red-300 rounded-lg hover:bg-red-500 hover:text-white">Adam Karlsten (ak222ye)</span></a>🍅
          </span>
        </div>

      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://tomato-meter.herokuapp.com')
  const measurements = await res.json()

  if (res.status !== 200) {
    console.error(json)
    throw new Error('Failed to fetch API')
  }

  return {
    props: {
      measurements
    },
    revalidate: 1
  }
}