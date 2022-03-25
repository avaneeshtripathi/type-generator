import "@styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { prefix } from "@utils/prefix";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="favicon" href={`${prefix}/favicon.ico`} />
        <title>Type Generator</title>
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}

export default MyApp;
