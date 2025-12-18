import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const discordRes = await client.GET("/user/me/discord");

    if (!discordRes.data) {
      return { props: { loginUrl: "" } };
    }

    return { props: { loginUrl: discordRes.data.url } };
  } catch (error) {
    console.error("Failed to fetch discord login url:", error);
    return { props: { loginUrl: "" } };
  }
};

type RegisterDiscordProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RegisterDiscordProfilePage = ({ loginUrl }: RegisterDiscordProfilePageProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("reg_discord") == null) {
      localStorage.setItem("reg_discord", "true");
    }
  }, []);

  return (
    <Box my={2}>
      <Typography>
        デジクリではDiscordサーバーを所有しています。正規の部員のみがDiscordサーバーに入れるようにアカウントと連携が必要です。
      </Typography>
      <Typography>
        Discordアカウントを持っていない方は先に
        <Link href="https://discord.com/register" target="_blank" rel="noopener noreferrer">
          Discordの登録ページ
        </Link>
        からアカウント作成を行いましょう。大学のメールアドレスで作る必要はありません！
      </Typography>
      <Box mt={10} textAlign="center">
        <Button href={loginUrl} variant="contained">
          Discord連携
        </Button>
      </Box>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
        <ButtonLink variant="outlined" href="/register/personal">
          前へ
        </ButtonLink>
        <ButtonLink variant="contained" href="/register/introduction">
          次へ
        </ButtonLink>
      </Stack>
    </Box>
  );
};

RegisterDiscordProfilePage.getLayout = (page: ReactElement) => (
  <RegisterStepLayout>{page}</RegisterStepLayout>
);

export default RegisterDiscordProfilePage;
