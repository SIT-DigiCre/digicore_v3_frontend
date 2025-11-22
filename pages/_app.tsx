import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Container, createTheme, Stack, ThemeProvider, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { RecoilRoot } from "recoil";

import Heading from "../components/Common/Heading";
import ErrorView from "../components/Error/ErrorView";
import AppBar from "../components/Home/AppBar";
import { useAuthState } from "../hook/useAuthState";
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
  const { authState } = useAuthState();
  const pathname = usePathname();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );
  const isPublicPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar>
        <Container component="main" sx={{ minHeight: "65vh", p: 0, px: 2 }}>
          <ErrorView />
          {authState.isLogined || isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <Stack alignItems="center" mt={20}>
              <Heading level={2}>ログインが必要です</Heading>
              <Typography>
                <Link href="/login">ログインページ</Link>
                にアクセスしてログインしてください。
              </Typography>
            </Stack>
          )}
        </Container>
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
