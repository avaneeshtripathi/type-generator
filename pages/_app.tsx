import "@styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { prefix } from "@utils/prefix";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="favicon" href={`${prefix}/favicon.ico`} />
        <title>Type Generator</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
