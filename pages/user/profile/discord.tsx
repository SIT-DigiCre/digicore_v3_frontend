import { useEffect } from "react";

import { Box, Button, Link, Typography } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";
import { useAuthState } from "../../../hook/useAuthState";

const DiscordProfilePage = () => {
  const { authState } = useAuthState();
  const discord = useDiscordLogin();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("reg_discord") == null) {
      localStorage.setItem("reg_discord", "true");
    }
  }, []);

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

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
