import { RecoilRoot } from "recoil";
import NavBar from "../components/Home/NavBar";
import "../style/common.css";
import "highlightjs/styles/vs2015.css";
import ErrorView from "../components/Error/ErrorView";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <NavBar />
      <ErrorView />
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default App;
