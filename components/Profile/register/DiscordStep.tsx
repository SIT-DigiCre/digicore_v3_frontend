import { useEffect } from "react";

import { Box, Button, Link, Typography } from "@mui/material";

import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";

const DiscordStep = () => {
  const discord = useDiscordLogin();

  useEffect(() => {
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
        <Button href={discord.loginUrl} variant="contained">
          Discord連携
        </Button>
      </Box>
    </Box>
  );
};

export default DiscordStep;
