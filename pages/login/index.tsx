import { Grid, Button, Container, Box, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import PageHead from "../../components/Common/PageHead";
import { useLoginData } from "../../hook/useLoginData";
const LoginPage = () => {
  const { loginUrl } = useLoginData();
  return (
    <>
      <PageHead title="Login" />
      <Container>
        <Grid item xs={12} style={{ marginTop: "30px" }}>
          <Box textAlign="center">
            <Button variant="contained" startIcon={<Google />} href={loginUrl}>
              Googleログイン
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <Typography textAlign="center">
            Googleアカウントはshibaura-it.ac.jpドメインのもののみ使用できます
          </Typography>
          <Typography textAlign="center">
            デジクリに入部希望の方は<a href="https://twitter.com/sitdigicre">公式Twitter</a>
            にご相談下さい
          </Typography>
        </Grid>
      </Container>
    </>
  );
};

export default LoginPage;
