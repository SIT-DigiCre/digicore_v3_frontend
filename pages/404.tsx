import { Button, Grid, Typography } from "@mui/material";

import Heading from "../components/Common/Heading";
import PageHead from "../components/Common/PageHead";

const NotFoundPage = () => {
  return (
    <>
      <PageHead title="ページが見つかりません" />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid size={12} textAlign="center">
          <Heading level={2}>404</Heading>
          <Typography>ページが見つかりません</Typography>
          <Button variant="contained" href="/">
            Home へ戻る
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default NotFoundPage;
