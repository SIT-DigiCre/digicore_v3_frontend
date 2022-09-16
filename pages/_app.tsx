import { RecoilRoot } from "recoil";
import NavBar from "../components/Home/NavBar";
import "../style/common.css";
import "highlightjs/styles/vs2015.css";
import ErrorView from "../components/Error/ErrorView";
import Head from "next/head";
import { createTheme, ThemeProvider, Typography } from "@mui/material";
import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useDarkMode } from "../hook/useDarkMode";

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
      <AppRoot Component={Component} pageProps={pageProps} />
    </RecoilRoot>
  );
};

const AppRoot = ({ Component, pageProps }) => {
  const { isDarkMode } = useDarkMode();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <ErrorView />
      <Component {...pageProps} />
      <footer style={{ textAlign: "center" }}>
        <Typography>
          <a href="https://intercom.help/icons8-7fb7577e8170/en/articles/5534926-universal-multimedia-licensing-agreement-for-icons8">
            Icons8 License
          </a>
        </Typography>
        <Typography>&copy;デジクリ/2022</Typography>
      </footer>
    </ThemeProvider>
  );
};
export default App;
