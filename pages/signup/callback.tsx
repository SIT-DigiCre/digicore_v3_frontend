import type { GetServerSideProps } from "next";

import { Stack, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import { createServerApiClient } from "../../utils/fetch/client";

type Props = {
  codeMissing?: boolean;
  signupFailed?: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req, res }) => {
  const code = typeof query.code === "string" ? query.code : null;
  if (!code) {
    return { props: { codeMissing: true } };
  }

  const client = createServerApiClient(req);
  const result = await client.POST("/signup/callback", { body: { code } });

  if (result.data?.jwt) {
    const jwt = result.data.jwt;
    const maxAge = 60 * 60 * 24 * 7;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", `jwt=${jwt}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`);
    return { redirect: { destination: "/register/public", permanent: false } };
  }

  return { props: { signupFailed: true } };
};

const SignupCallbackPage = ({ codeMissing, signupFailed }: Props) => {
  if (codeMissing || signupFailed) {
    return (
      <Stack alignItems="center" mt={20}>
        <Heading level={4}>登録に失敗しました</Heading>
        <Typography variant="body1">登録からやり直して下さい。</Typography>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" mt={20}>
      <Heading level={4}>登録処理中...</Heading>
      <Typography variant="body1">
        （この画面が長時間出る場合は登録からやり直して下さい）
      </Typography>
    </Stack>
  );
};

export default SignupCallbackPage;
