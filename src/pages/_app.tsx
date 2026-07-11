import type { NextPage } from "next";
import { type ReactElement, type ReactNode, useMemo } from "react";

import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";

import { DarkModeProvider, useDarkModeContext } from "../components/contexts/DarkModeContext";
import { ErrorStateProvider } from "../components/contexts/ErrorStateContext";
import { PageTitleProvider } from "../components/contexts/PageTitleContext";
import AccessControl from "../components/Home/AccessControl";
import AppBar from "../components/Home/AppBar";

import type { AppProps } from "next/app";
import "../style/common.css";

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
  const { isDarkMode } = useDarkModeContext();
  const themeColor = isDarkMode ? "#121212" : "#ffffff";
  const statusBarStyle = isDarkMode ? "black-translucent" : "default";
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
        typography: {
          fontFamily: ["-apple-system", '"Noto Sans JP"', "sans-serif"].join(","),
        },
      }),
    [isDarkMode],
  );

  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover"
        />
        <meta name="theme-color" content={themeColor} />
        <meta name="apple-mobile-web-app-status-bar-style" content={statusBarStyle} />
      </Head>
      <CssBaseline />
      <AppBar>
        <AccessControl>{getLayout(<Component {...pageProps} />)}</AccessControl>
      </AppBar>
    </ThemeProvider>
  );
};
export default App;
