import { Google } from "@mui/icons-material";
import { Grid, Button, Container, Typography, Box } from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import { useRegisterData } from "../../hook/useRegisterData";

const RegisterPage = () => {
  const { registerUrl } = useRegisterData();
  return (
    <>
      <PageHead title="登録" />
      <Container>
        <Grid size={12} style={{ marginTop: "30px" }}>
          <Box textAlign="center">
            <h2>デジコア登録ページ</h2>
            <p>デジクリの入部もこちらからできます</p>
          </Box>
        </Grid>
        <Grid style={{ marginTop: "20px" }}>
          <Box textAlign="center">
            <Button variant="contained" startIcon={<Google />} href={registerUrl}>
              大学Googleアカウントで登録
            </Button>
            <Typography>
              芝浦工業大学より支給されているshibaura-it.ac.jpのドメインでのみ登録が可能です。
            </Typography>
          </Box>
        </Grid>
      </Container>
    </>
  );
};

export default RegisterPage;
