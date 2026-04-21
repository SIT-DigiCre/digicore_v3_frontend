import type { GetServerSideProps } from "next";

import { Stack, Typography } from "@mui/material";

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import { createServerApiClient } from "@/utils/fetch/client";

type Props = {
  codeMissing?: boolean;
  duplicatedSignup?: boolean;
  signupFailed?: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req, res }) => {
  const code = typeof query.code === "string" ? query.code : null;
  if (!code) {
    return { props: { codeMissing: true } };
  }

  const client = createServerApiClient(req);
  const result = await client.POST("/signup/callback", { body: { code } });

  // 重複登録時にはリダイレクトを促すページを表示する
  if (result.response.status == 409) {
    return { props: { duplicatedSignup: true } };
  }

  if (result.data?.jwt) {
    const jwt = result.data.jwt;
    const maxAge = 60 * 60 * 24 * 7;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", `jwt=${jwt}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`);
    return { redirect: { destination: "/tutorial/welcome", permanent: false } };
  }

  return { props: { signupFailed: true } };
};

const SignupCallbackPage = ({ codeMissing, duplicatedSignup, signupFailed }: Props) => {
  if (duplicatedSignup) {
    return (
      <Stack alignItems="center" mt={20} gap={2}>
        <Heading level={4}>既に登録済みです</Heading>
        <Typography variant="body1">ログインしてからユーザー情報登録に進んでください。</Typography>
        <ButtonLink href="/tutorial/welcome" variant="contained">
          ログインへ
        </ButtonLink>
      </Stack>
    );
  }

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
