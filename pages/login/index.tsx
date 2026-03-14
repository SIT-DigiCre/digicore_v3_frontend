import type { GetServerSideProps } from "next";
import Image from "next/image";

import { Google } from "@mui/icons-material";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { createServerApiClient } from "../../utils/fetch/client";

type LoginPageProps = {
  loginUrl: string;
  flashMessage: string | null;
  nextUrl: string | null;
};

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async ({ query }) => {
  const client = createServerApiClient(); // 有効期限切れのjwtを付与しないようにするため、reqを渡さない
  const res = await client.GET("/login");
  const loginUrl = res.data?.url ?? "";
  const flashMessage =
    query.flash === "login-required" ? "このページを表示するにはログインが必要です。" : null;
  const nextUrl = typeof query.next === "string" ? query.next : null;
  return { props: { flashMessage, loginUrl, nextUrl } };
};

const LoginPage = ({ loginUrl, flashMessage, nextUrl }: LoginPageProps) => {
  const nextCookieValue =
    nextUrl && nextUrl.startsWith("/") && !nextUrl.startsWith("//")
      ? encodeURIComponent(nextUrl)
      : null;

  const handleLoginClick = () => {
    const maxAge = 60 * 10; // 10分間
    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";
    if (nextCookieValue) {
      document.cookie = `next=${nextCookieValue}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    }
  };

  return (
    <>
      <PageHead title="ログイン" />
      <Stack alignItems="center" mt={20}>
        {flashMessage && (
          <Alert severity="info" sx={{ maxWidth: 480, mb: 3, width: "100%" }}>
            {flashMessage}
          </Alert>
        )}
        <Image
          src="/image/digicre-logo.webp"
          alt="デジクリ Digital Creation Circle"
          width={333}
          height={111}
        />
        <Heading level={2}>DigiCore v3</Heading>
        <Box my={10}>
          <Button
            variant="contained"
            startIcon={<Google aria-label="Google" />}
            href={loginUrl}
            onClick={handleLoginClick}
          >
            ログインする
          </Button>
        </Box>
        <Box>
          <Typography>
            Googleアカウントはshibaura-it.ac.jpドメインのもののみ使用できます。
          </Typography>
          <Typography>
            デジクリに入部希望の方は contact@digicre.net までメールするか、
            <a href="https://twitter.com/sitdigicre" target="_blank" rel="noopener noreferrer">
              公式Twitter
            </a>
            にご相談下さい。
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default LoginPage;
