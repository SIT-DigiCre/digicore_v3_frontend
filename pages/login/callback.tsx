import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";

import { CheckCircle, CopyAll } from "@mui/icons-material";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { createServerApiClient } from "@/utils/fetch/client";

type LoginCallbackPageProps = {
  loginFailed?: boolean;
  errorMessage?: string;
  codeMissing?: boolean;
};

const setJwtCookie = (res: { setHeader: (name: string, value: string) => void }, jwt: string) => {
  const maxAge = 60 * 60 * 24 * 7;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `jwt=${jwt}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`);
};

const isInactiveAccountError = (message?: string): boolean => {
  if (!message) return false;
  return message.includes("無効なアカウントです");
};

export const getServerSideProps: GetServerSideProps<LoginCallbackPageProps> = async ({
  query,
  res,
}) => {
  const code = typeof query.code === "string" ? query.code : null;
  if (!code) {
    return { props: { codeMissing: true } };
  }

  const client = createServerApiClient();
  const result = await client.POST("/login/callback", { body: { code } });

  const redirectToReentry = (statusMessageRaw: string, jwt?: string) => {
    const statusMessage = encodeURIComponent(statusMessageRaw);
    const reentryCode = encodeURIComponent(code);
    if (jwt) {
      setJwtCookie(res, jwt);
    }
    return {
      redirect: {
        destination: `/login/reentry?message=${statusMessage}&reentryCode=${reentryCode}`,
        permanent: false,
      },
    };
  };

  if (result.data?.jwt) {
    const jwt = result.data.jwt;
    const meResult = await client.GET("/user/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (meResult.data) {
      setJwtCookie(res, jwt);
      return { redirect: { destination: "/", permanent: false } };
    }

    if (isInactiveAccountError(meResult.error?.message)) {
      return redirectToReentry(meResult.error?.message ?? "", jwt);
    }

    const errorMessage = meResult.error ? JSON.stringify(meResult.error) : "";
    return { props: { errorMessage, loginFailed: true } };
  }

  if (isInactiveAccountError(result.error?.message)) {
    return redirectToReentry(result.error?.message ?? "");
  }

  const errorMessage = result.error ? JSON.stringify(result.error) : "";
  return { props: { errorMessage, loginFailed: true } };
};

const LoginCallbackPage = ({ loginFailed, errorMessage, codeMissing }: LoginCallbackPageProps) => {
  const [isCopied, setIsCopied] = useState(false);

  if (codeMissing) {
    return (
      <Box>
        <Heading level={2}>認証コードがありません</Heading>
        <Typography>ログインからやり直してください。</Typography>
      </Box>
    );
  }

  if (loginFailed) {
    return (
      <>
        <PageHead title="ログイン" />
        <Box>
          <Heading level={2}>ログイン失敗</Heading>
          <Typography>ログインに失敗しました。</Typography>
          <Typography>
            部費振込を忘れていた場合や、心当たりがない場合は、
            <Link href="https://forms.gle/MQicA1No8LSZPe5QA" target="_blank" rel="noopener">
              インフラサポートフォーム
            </Link>
            をご利用ください。お問い合わせの際は以下のエラーメッセージを添えていただけると幸いです。
          </Typography>
          <Stack spacing={2} alignItems="center" mt={2}>
            {errorMessage && (
              <Button
                startIcon={isCopied ? <CheckCircle /> : <CopyAll />}
                variant="contained"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(errorMessage);
                    setIsCopied(true);
                  } catch {
                    window.alert(
                      "クリップボードへのコピーに失敗しました。手動でコピーしてください。",
                    );
                  }
                }}
              >
                {isCopied ? "コピーしました" : "エラーメッセージをコピー"}
              </Button>
            )}
            <TextField value={errorMessage ?? ""} disabled fullWidth multiline rows={10} />
          </Stack>
        </Box>
      </>
    );
  }

  return null;
};

export default LoginCallbackPage;
