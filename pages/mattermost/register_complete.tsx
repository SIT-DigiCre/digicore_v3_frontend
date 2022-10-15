import { Container, Grid, Typography } from "@mui/material";
import PageHead from "../../components/Common/PageHead";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const RegisterComplete = () => {
  return (
    <Container>
      <PageHead title="Mattermost アカウント登録完了" />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: "Mattermost", href: "/mattermost" },
          { text: "Account Registration Complete" },
        ]}
      />
      <Grid margin={2}>
        <Typography variant="h4" align="center" noWrap={true}>
          Mattermost
        </Typography>
        <Typography variant="h4" align="center" noWrap={true}>
          アカウント登録完了
        </Typography>
      </Grid>
      <Grid margin={2}>
        <Typography align="center">Mattermost アカウントの作成に成功しました</Typography>
        <Typography align="center">さぁ、始めましょう</Typography>
        <Typography align="center">
          <a href="https://mm.digicre.net" target="_blank" rel="noreferrer">
            Mattermost ログインページ
          </a>
        </Typography>
      </Grid>
    </Container>
  );
};

export default RegisterComplete;
