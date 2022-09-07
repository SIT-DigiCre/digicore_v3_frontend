import { Container, Grid, Typography } from "@mui/material";
import PageHead from "../components/Common/PageHead";

const NotFoundPage = () => {
  return (
    <>
      <Container>
        <PageHead title="お探しのページが見つかりません" />
        <Grid>
          <Typography variant="h2" component="h1" textAlign="center">
            404: Page Not Found
          </Typography>
        </Grid>
      </Container>
    </>
  );
};

export default NotFoundPage;
