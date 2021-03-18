import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Header from 'components/Header'
import ChartContainer from 'components/ChartContainer'

export default function Home({measurements}) {
  return (
    <div className="container mx-auto bg-red-100 rounded-xl h-full text-gray-700">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center p-14">
        <Header />

        <div className="mt-6 text-center max-w-md">
          <p className="text-xl font-bold mb-2">
            How is my tomato plant doing? 🍅
          </p>
          <p className="text-sm">
            This website will allow you to check up on one of the cherry tomato plants in my windowsill.
            We keep track of the air temperature, humidity, soil moisture and light levels with a LoPy4 microcontroller and upload it to our database.
          </p>
        </div>
        <ChartContainer measurements={measurements} />
      </main>

      <footer className="flex items-center align-middle justify-center pb-4">
        <div className="flex items-center text-center bg-red-300 p-2 rounded-lg">
          <span className="font-semibold text-sm text-gray-800">
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