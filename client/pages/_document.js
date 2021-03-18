import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className={'bg-red-300 antialiased mx-auto'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
