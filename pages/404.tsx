import { Button, Grid, Typography } from "@mui/material";
import PageHead from "../components/Common/PageHead";

const NotFoundPage = () => {
  return (
    <>
      <PageHead title="ページが見つかりません" />

      <Grid container direction="column" alignItems="center" spacing={8}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h2" component="h1">
            404
          </Typography>
          <Typography paragraph={true}>ページが見つかりません</Typography>

          <Button variant="contained" href="/">
            Home へ戻る
          </Button>
        </Grid>

        {/* TODO: デジコのイラストをランダムで表示する */}
      </Grid>
    </>
  );
};

export default NotFoundPage;
