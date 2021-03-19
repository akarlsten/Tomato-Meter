import Head from 'next/head'
import styles from '../styles/Home.module.css'

import ChartContainer from 'components/ChartContainer'

export default function Home({measurements}) {
  return (
    <div className="container mx-auto max-w-7xl bg-red-100 rounded-xl h-full text-gray-700">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center p-10">
        <div className="w-full grid justify-items-center gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
          <div className="max-w-md">
            <p className="text-xl font-bold mb-2 text-center">
              How is my tomato plant doing? 🍅
            </p>
            <p className="text-sm">
              This website will allow you to check up on one of the cherry tomato plants in my windowsill.
              We keep track of the air temperature, humidity, soil moisture and light levels and present it as graphs.
            </p>
          </div>
          <div className="max-w-md">
            <p className="text-xl font-bold mb-2 text-center">
              Project Description 🏗
            </p>
            <p className="text-sm">
              The project is backed by a LoPy4 microcontroller using a DHT11 temp/humidity sensor, a TSL2591 light sensor and a VMA303 soil moisture sensor.
              The data is gathered every 30 minutes and is then POSTed to a REST api where it is stored in a database. This frontend site queries that API.
            </p>
          </div>
        </div>
        <ChartContainer measurements={measurements} />
      </main>

      <footer className="flex items-center align-middle justify-center pb-4">
        <div className="flex items-center text-center p-2 rounded-lg">
          <span className="font-semibold text-lg text-gray-700">
            <p>made with 🍅</p> by <a className="hover:text-red-400" rel="noopener noreferrer" target="_blank" href="https://adamkarlsten.com">Adam Karlsten</a> (ak222ye)
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