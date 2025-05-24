import { useMemo } from "react";

import { createTheme, ThemeProvider, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { RecoilRoot } from "recoil";

import ErrorView from "../components/Error/ErrorView";
import NavBar from "../components/Home/NavBar";
import { useDarkMode } from "../hook/useDarkMode";
import "../style/common.css";

import "highlightjs/styles/vs2015.css";

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
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
