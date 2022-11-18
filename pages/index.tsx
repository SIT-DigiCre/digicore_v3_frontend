import { Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import PageHead from "../components/Common/PageHead";
import { useAuthState } from "../hook/useAuthState";

const IndexPage = () => {
  const { authState } = useAuthState();
  return (
    <Container>
      <PageHead title="Home" />
      <Grid>
        <h1>ようこそ、デジコア3.0へ</h1>
        <p>デジコア3.0は開発途上のアプリケーションです。優しい気持ちで接してみてください</p>
        <div className="index_calender">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=sitdigicrecircle%40gmail.com&ctz=Asia%2FTokyo"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </Grid>
      <Grid>
        {authState.isLogined ? (
          <>
            <h2>使いそうな項目</h2>
            <Typography>
              <Link href="/user/joined">入部完了ページ</Link>
              ：部費の入金先やSlack、Discordへの参加リンクがあります
            </Typography>
          </>
        ) : (
          <>
            <Typography>
              ログインが出来ていないようですね。右上のログインボタンからログインしましょう
            </Typography>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default IndexPage;
