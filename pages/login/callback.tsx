import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CheckCircle, CopyAll } from "@mui/icons-material";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { useLoginData } from "../../hook/useLoginData";

type Props = {
  code: string;
};

const LoginCallbackPage = ({ code }: Props) => {
  const { setCallbackCode } = useLoginData();
  const router = useRouter();
  const { onLogin } = useAuthState();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { errors } = useErrorState();

  const errorMessage = errors.map((e) => e.message).join("\n");

  useEffect(() => {
    setCallbackCode(code)
      .then((jwt) => {
        if (jwt) {
          onLogin(jwt);
        }
        if (localStorage.getItem("backto")) {
          const backto = localStorage.getItem("backto");
          localStorage.removeItem("backto");
          if (backto) {
            router.push(backto);
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
        }
      })
      .catch(() => {
        setIsLoggingIn(false);
      });
  }, []);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  if (isLoggingIn) {
    return (
      <Box>
        <Heading level={2}>ログイン処理中</Heading>
        <Typography>この画面が長時間出る場合はログインからやり直してください。</Typography>
      </Box>
    );
  }

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
          <Button
            startIcon={isCopied ? <CheckCircle /> : <CopyAll />}
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(errorMessage);
              setIsCopied(true);
            }}
          >
            {isCopied ? "コピーしました" : "エラーメッセージをコピー"}
          </Button>
          <TextField value={errorMessage} disabled fullWidth multiline rows={10} />
        </Stack>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { code } = query;
    const codeStr = typeof code === "string" ? code : null;
    return { props: { code: codeStr } };
  } catch (error: unknown) {
    return {
      props: { errors: error instanceof Error ? error.message : "An unknown error occurred" },
    };
  }
};
export default LoginCallbackPage;
