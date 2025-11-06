import { Container, Grid, Typography } from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import Heading from "../Common/Heading";

export const MattermostRegisterComplete = () => {
  return (
    <Container>
      <PageHead title="Mattermost アカウント登録完了" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Mattermost" }]} />
      <Grid margin={2}>
        <Heading level={4}>Mattermost</Heading>
        <Heading level={4}>アカウント登録完了</Heading>
      </Grid>
      <Grid margin={2}>
        <Typography align="center">Mattermost アカウントの作成に成功しました</Typography>
        <Typography align="center">さぁ、始めましょう</Typography>
        <Typography align="center">
          <a href="https://mm.digicre.net" target="_blank" rel="noreferrer">
            Mattermost ログインページ
          </a>
        </Typography>
        <Typography align="center">
          <a href="https://mattermost.com/apps/" target="_blank" rel="noreferrer">
            アプリの取得はこちらから
          </a>
        </Typography>
      </Grid>
    </Container>
  );
};
