import '../styles/globals.css'
import Header from 'components/Header'

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gradient-to-b from-red-300 to-red-500 h-full p-4">
      <div className="mb-4">
        <Header />
      </div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
