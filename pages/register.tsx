import { useAuthState } from "../hook/useAuthState";
import { Grid, Button, Container, Typography } from "@mui/material";
import { baseURL } from "../utils/common";
import { Google } from "@mui/icons-material";
import PageHead from "../components/Common/PageHead";

const RegisterPage = () => {
  const { authState } = useAuthState();
  return (
    <>
      <PageHead title="登録" />
      <Container>
        <Grid>
          <h2>デジコア登録ページ</h2>
          <p>デジクリの入部もこちらからできます</p>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            startIcon={<Google />}
            href={baseURL + "/google/oauth/url/?register=true"}
          >
            大学Googleアカウントで登録
          </Button>
          <Typography>
            芝浦工業大学より支給されているshibaura-it.ac.jpのドメインでのみ登録が可能です。
          </Typography>
        </Grid>
      </Container>
    </>
  );
};

export default RegisterPage;
