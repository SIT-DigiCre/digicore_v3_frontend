import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import Link from "next/link";
import { ReactElement, useEffect } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";
import { createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const discordRes = await client.GET("/user/me/discord");

    if (!discordRes.data) {
      return { props: { loginUrl: "" } } as const;
    }

    return { props: { loginUrl: discordRes.data.url } };
  } catch (error) {
    console.error("Failed to fetch discord login url:", error);
    return { props: { loginUrl: "" } };
  }
};

type DiscordProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const DiscordProfilePage = ({ loginUrl }: DiscordProfilePageProps) => {
  const discord = useDiscordLogin();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("reg_discord") == null) {
      localStorage.setItem("reg_discord", "true");
    }
  }, []);

  return (
    <>
      <Stack spacing={2}>
        <Heading level={2}>Discord連携</Heading>
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
          <Button href={loginUrl || discord.loginUrl} variant="contained">
            Discord連携
          </Button>
        </Box>
      </Stack>
    </>
  );
};

DiscordProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default DiscordProfilePage;
