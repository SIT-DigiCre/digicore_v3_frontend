import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { useMemo, type ReactElement, type ReactNode } from "react";

import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { DarkModeProvider, useDarkMode } from "../components/DarkModeContext";
import { ErrorStateProvider } from "../components/ErrorStateContext";
import AccessControl from "../components/Home/AccessControl";
import AppBar from "../components/Home/AppBar";
import { PageTitleProvider } from "../components/PageTitleContext";
import "../style/common.css";

import "highlightjs/styles/vs2015.css";

// ref: https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript
export type NextPageWithLayout<P = unknown> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps, router }: AppPropsWithLayout) => {
  return (
    <ErrorStateProvider>
      <DarkModeProvider>
        <PageTitleProvider>
          <AppRoot Component={Component} pageProps={pageProps} router={router} />
        </PageTitleProvider>
      </DarkModeProvider>
    </ErrorStateProvider>
  );
};

const AppRoot = ({ Component, pageProps }: AppPropsWithLayout) => {
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

  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar>
        <AccessControl>{getLayout(<Component {...pageProps} />)}</AccessControl>
      </AppBar>
    </ThemeProvider>
  );
};
export default App;
