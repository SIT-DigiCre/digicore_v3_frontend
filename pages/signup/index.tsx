import { Grid, Button, Container, Typography } from "@mui/material";
import { baseURL } from "../../utils/common";
import { Google } from "@mui/icons-material";
import PageHead from "../../components/Common/PageHead";
import { useRegisterData } from "../../hook/useRegisterData";

const RegisterPage = () => {
  const { registerUrl } = useRegisterData();
  return (
    <>
      <PageHead title="登録" />
      <Container>
        <Grid>
          <h2>デジコア登録ページ</h2>
          <p>デジクリの入部もこちらからできます</p>
        </Grid>
        <Grid>
          <Button variant="contained" startIcon={<Google />} href={registerUrl}>
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
