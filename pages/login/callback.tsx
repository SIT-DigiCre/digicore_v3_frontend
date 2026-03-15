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

const MAX_NEXT_URL_LENGTH = 2048;

const normalizeNextUrl = (value: string | undefined): string => {
  if (!value) return "/";
  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "/";
  }
  // 制御文字（CRLF やタブ等）を含む値は拒否する
  if (/[\u0000-\u001F\u007F]/.test(decoded)) return "/";
  // 過度に長い値も拒否することでヘッダー汚染やリソース消費を防ぐ
  if (decoded.length > MAX_NEXT_URL_LENGTH) return "/";
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";
  return decoded;
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

const isPendingReentryError = (message?: string): boolean => {
  if (!message) return false;
  return (
    message.includes("未処理の再入部申請があります") ||
    message.includes("再入部申請の確認中です") ||
    message.includes("確認中")
  );
};

const shouldRedirectToReentry = (message?: string): boolean => {
  return isInactiveAccountError(message) || isPendingReentryError(message);
};

export const getServerSideProps: GetServerSideProps<LoginCallbackPageProps> = async ({
  query,
  req,
  res,
}) => {
  const code = typeof query.code === "string" ? query.code : null;
  if (!code) {
    return { props: { codeMissing: true } };
  }

  const client = createServerApiClient();
  const result = await client.POST("/login/callback", { body: { code } });

  const setAuthCookies = (jwt: string) => {
    const maxAge = 60 * 60 * 24 * 7;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", [
      `jwt=${jwt}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`,
      `next=; Path=/; Max-Age=0; SameSite=Lax${secure}`,
    ]);
  };

  const redirectToReentry = (statusMessageRaw: string, jwt?: string) => {
    const statusMessage = encodeURIComponent(statusMessageRaw);
    if (jwt) {
      setAuthCookies(jwt);
    }
    return {
      redirect: {
        destination: `/login/reentry?message=${statusMessage}`,
        permanent: false,
      },
    };
  };

  if (result.data?.jwt) {
    const jwt = result.data.jwt;
    const nextCookie = req.cookies?.next;
    const nextUrl = normalizeNextUrl(nextCookie);
    const meResult = await client.GET("/user/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (meResult.data) {
      setAuthCookies(jwt);
      return { redirect: { destination: nextUrl, permanent: false } };
    }

    if (shouldRedirectToReentry(meResult.error?.message)) {
      return redirectToReentry(meResult.error?.message ?? "", jwt);
    }

    const errorMessage = meResult.error ? JSON.stringify(meResult.error) : "";
    return { props: { errorMessage, loginFailed: true } };
  }

  if (shouldRedirectToReentry(result.error?.message)) {
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
