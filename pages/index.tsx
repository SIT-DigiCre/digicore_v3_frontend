import Link from "next/link";

import { Grid, Typography } from "@mui/material";

import PageHead from "../components/Common/PageHead";
import { useAuthState } from "../hook/useAuthState";

const IndexPage = () => {
  const { authState } = useAuthState();
  if (!authState.isLogined)
    return (
      <>
        <PageHead title="Home 未ログイン" />
        <p>未ログイン状態です。ログインしてください。</p>
      </>
    );
  return (
    <>
      <PageHead title="Home" />
      <Grid>
        <h1>ようこそ、デジコア3.1へ</h1>
        <p>デジコア3.1は開発途上のアプリケーションです。優しい気持ちで接してみてください</p>
        <div className="index_calender">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=sitdigicrecircle%40gmail.com&ctz=Asia%2FTokyo"
            style={{ border: 0 }}
            width="800"
            height="600"
          ></iframe>
        </div>
      </Grid>
      <Grid>
        <h2>使いそうな項目</h2>
        <Typography>
          <Link href="/user/joined">入部完了ページ</Link>
          ：部費の入金先やMattermost、Discordへの参加リンクがあります
        </Typography>
      </Grid>
    </>
  );
};

export default IndexPage;
