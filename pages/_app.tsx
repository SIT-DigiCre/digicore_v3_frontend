import { useMemo } from "react";

import { createTheme, ThemeProvider, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { RecoilRoot } from "recoil";

import ErrorView from "../components/Error/ErrorView";
import AppBar from "../components/Home/AppBar";
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
      <AppBar>
        <main style={{ minHeight: "65vh" }}>
          <ErrorView />
          <Component {...pageProps} />
        </main>
        <footer style={{ textAlign: "center", padding: "2rem 0" }}>
          <Typography>
            <a href="https://intercom.help/icons8-7fb7577e8170/en/articles/5534926-universal-multimedia-licensing-agreement-for-icons8">
              Icons8 License
            </a>
          </Typography>
          <Typography>&copy; 2022-2025</Typography>
          <Typography>芝浦工業大学 デジクリ</Typography>
        </footer>
      </AppBar>
    </ThemeProvider>
  );
};
export default App;
