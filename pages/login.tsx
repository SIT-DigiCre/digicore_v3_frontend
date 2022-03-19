import { Grid, Button, Container } from "@mui/material";
import { Google } from "@mui/icons-material";
import { baseURL } from "../utils/common";
const LoginPage = () => {
  return (
    <>
      <Container>
        <Grid xs={12} justifyItems="center">
          <Grid item xs={4}>
            <Button variant="contained" startIcon={<Google />} href={baseURL + "/google/oauth/url"}>
              Googleログイン
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LoginPage;
