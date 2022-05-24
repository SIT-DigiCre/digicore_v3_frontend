import { Grid, Button, Container, Typography } from "@mui/material";
import { baseURL } from "../utils/common";
import { Google } from "@mui/icons-material";
import { useEffect } from "react";

const ExistMemberRegisterPage = () => {
  useEffect(() => {
    sessionStorage.setItem("exist-member", "true");
  }, []);
  return (
    <>
      <Container>
        <Grid>
          <h2>デジコア既存生向け登録ページ</h2>
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

export default ExistMemberRegisterPage;
