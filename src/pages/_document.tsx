import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/digicore_favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/digicore_favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/digicore_favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
