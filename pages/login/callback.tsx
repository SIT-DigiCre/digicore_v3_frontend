import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useAuthState } from "../../hook/useAuthState";
import { useLoginData } from "../../hook/useLoginData";

type Props = {
  code: string;
};

const LoginCallbackPage = ({ code }: Props) => {
  const { setCallbackCode } = useLoginData();
  const router = useRouter();
  const { onLogin } = useAuthState();
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  useEffect(() => {
    setCallbackCode(code)
      .then((jwt) => {
        onLogin(jwt);
        if (localStorage.getItem("backto")) {
          const backto = localStorage.getItem("backto");
          localStorage.removeItem("backto");
          router.push(backto);
        } else {
          router.push("/");
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoggingIn(false);
      });
  }, []);

  if (isLoggingIn) {
    return <Box>ログイン処理中... （この画面が長時間出る場合はログインからやり直して下さい）</Box>;
  }

  return (
    <>
      <PageHead title="ログイン" />
      <Box>
        <Heading level={2}>ログイン失敗</Heading>
        <Typography>
          何度か試行しても解決できない場合はインフラサポートフォームをご利用ください
        </Typography>
        <a href="https://forms.gle/MQicA1No8LSZPe5QA" target="_blank" rel="noopener">
          サポートフォームを開く
        </a>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { code } = query;
    const codeStr = typeof code === "string" ? code : null;
    return { props: { code: codeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
export default LoginCallbackPage;
