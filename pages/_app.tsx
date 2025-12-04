import { useMemo } from "react";

import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { RecoilRoot } from "recoil";

import AccessControl from "../components/Home/AccessControl";
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
        <AccessControl>
          <Component {...pageProps} />
        </AccessControl>
      </AppBar>
    </ThemeProvider>
  );
};
export default App;
