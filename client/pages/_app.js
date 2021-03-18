import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-red-300 h-full p-4">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
