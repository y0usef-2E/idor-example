import Head from "next/head";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>IDOR Example</title>
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
