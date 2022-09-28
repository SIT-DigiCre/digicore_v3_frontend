import { Button, Card, CardContent, CardHeader, Container, Fab, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useWorks } from "../../hook/work/useWork";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ChipList from "../../components/Common/ChipList";
import { WorkCardPreview } from "../../components/work/WorkCardPreview";

const WorkIndexPage = () => {
  const { works, loadMore } = useWorks();
  const router = useRouter();
  return (
    <Container>
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Work" }]} />
      <Grid>
        <div>
          <h1 className="d-inlineblock">Work一覧</h1>
          <div style={{ float: "right" }}>
            <Button
              variant="contained"
              sx={{ margin: "0.1rem" }}
              onClick={() => {
                router.push(`/work/new`);
              }}
            >
              新規Work
            </Button>
            <Button variant="contained" sx={{ margin: "0.1rem" }}>
              My Work
            </Button>
            <Button
              variant="contained"
              sx={{ margin: "0.1rem" }}
              onClick={() => {
                router.push(`/work/tag`);
              }}
            >
              WorkTag一覧
            </Button>
          </div>
        </div>
        <hr style={{ clear: "both" }} />
      </Grid>
      <Grid container>
        {works.map((w) => (
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{ width: "100%", display: "inline-block", m: 0.5 }}
              onClick={() => {
                router.push(`/work/${w.id}`);
              }}
              className="clickable-gray"
              key={w.id}
            >
              <CardHeader title={w.name}></CardHeader>
              <CardContent>
                <WorkCardPreview id={w.id} />
                <ChipList chipList={w.tags.map((t) => t.name)} />
              </CardContent>
            </Card>
          </Grid>
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
