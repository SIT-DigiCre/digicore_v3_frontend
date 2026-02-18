import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { type ReactElement, type ReactNode, useMemo } from "react";

import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { DarkModeProvider, useDarkModeContext } from "../components/contexts/DarkModeContext";
import { ErrorStateProvider } from "../components/contexts/ErrorStateContext";
import { PageTitleProvider } from "../components/contexts/PageTitleContext";
import AccessControl from "../components/Home/AccessControl";
import AppBar from "../components/Home/AppBar";
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
      <CssBaseline />
      <AppBar>
        <AccessControl>{getLayout(<Component {...pageProps} />)}</AccessControl>
      </AppBar>
    </ThemeProvider>
  );
};
export default App;
