import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="favicon" href="/favicon.png" />
        <title>Type Generator</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
