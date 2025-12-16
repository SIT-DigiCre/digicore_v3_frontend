import Link from "next/link";
import { useEffect } from "react";

import { Box, Button, Typography } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";

const DiscordProfilePage = () => {
  const discord = useDiscordLogin();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("reg_discord") == null) {
      localStorage.setItem("reg_discord", "true");
    }
  }, []);

  return (
    <EditorTabLayout>
      <Box my={2}>
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
          <Button href={discord.loginUrl} variant="contained">
            Discord連携
          </Button>
        </Box>
      </Box>
    </EditorTabLayout>
  );
};

export default DiscordProfilePage;
