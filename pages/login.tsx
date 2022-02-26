import { Grid, Button, Container } from "@mui/material";
import { Google } from "@mui/icons-material";
const LoginPage = () => {
  const onClickLogin = () => {};
  return (
    <>
      <Container>
        <Grid xs={12} justifyItems="center">
          <Grid item xs={4}>
            <Button variant="contained" startIcon={<Google />} onClick={onClickLogin}>
              Googleログイン
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LoginPage;
