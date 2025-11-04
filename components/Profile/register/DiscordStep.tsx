import { useEffect } from "react";
import { Button, Typography } from "@mui/material";

import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";

const DiscordStep = () => {
  const discord = useDiscordLogin();

  useEffect(() => {
    if (localStorage.getItem("reg_discord") == null) {
      localStorage.setItem("reg_discord", "true");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "1em" }}>
      <Typography>
        デジクリではDiscordサーバーを所有しています。
        正規の部員のみがDiscordサーバーに入れるようにアカウントと連携が必要です。
      </Typography>
      <Typography>
        Discordアカウントを持っていない方は先に
        <a href="https://discord.com/register" target="_blank" rel="noopener">
          こちらから
        </a>
        Discordのアカウント作成を行いましょう（大学のメールアドレスで作る必要はありません!）
      </Typography>
      <Button href={discord.loginUrl} variant="contained">
        Discord連携
      </Button>
    </div>
  );
};

export default DiscordStep;
