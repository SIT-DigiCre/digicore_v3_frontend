import { Button, Card, CardHeader, Container, Fab, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useWorks } from "../../hook/work/useWork";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const WorkIndexPage = () => {
  const { works, loadMore } = useWorks();
  const router = useRouter();
  return (
    <Container>
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Work" }]} />
      <Grid>
        <h1>Work一覧</h1>
        <hr />
      </Grid>
      <Grid>
        {works.map((w) => (
          <Card
            sx={{ width: "32%", display: "inline-block", m: 0.5 }}
            onClick={() => {
              router.push(`/work/${w.id}`);
            }}
            className="clickable"
            key={w.id}
          >
            <CardHeader title={w.name}></CardHeader>
          </Card>
        ))}
      </Grid>
      <Grid sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            loadMore();
          }}
        >
          Load More
        </Button>
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          router.push(`/work/new`);
        }}
        sx={{ position: "absolute", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};
export default WorkIndexPage;
