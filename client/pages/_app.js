import '../styles/globals.css'
import Header from 'components/Header'

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-red-300 h-full p-4">
      <div className="mb-4">
        <Header />
      </div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
