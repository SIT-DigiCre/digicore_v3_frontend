import { useRouter } from "next/router";

import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
} from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import ChipList from "../../components/Common/ChipList";
import PageHead from "../../components/Common/PageHead";
import { WorkCardPreview } from "../../components/Work/WorkCardPreview";
import { useWorks } from "../../hook/work/useWork";

const WorkIndexPage = () => {
  const { works, loadMore } = useWorks();
  const router = useRouter();

  return (
    <>
      <PageHead title="Work一覧" />
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
            <Button
              variant="contained"
              sx={{ margin: "0.1rem" }}
              onClick={() => {
                router.push(`/work/mywork`);
              }}
            >
              My Work
            </Button>
            {/*<Button
              variant="contained"
              sx={{ margin: "0.1rem" }}
              onClick={() => {
                router.push(`/work/tag`);
              }}
            >
              WorkTag一覧
            </Button>*/}
          </div>
        </div>
        <hr style={{ clear: "both" }} />
      </Grid>
      <Grid container>
        {works ? (
          <>
            {works.map((w) => (
              <Grid key={w.workId} size={[12, 6, 4]} sx={{ padding: 0.5 }}>
                <Card
                  sx={{ width: "100%", display: "inline-block", m: 0.5, height: "100%" }}
                  onClick={() => {
                    router.push(`/work/${w.workId}`);
                  }}
                  className="clickable-gray"
                  key={w.workId}
                >
                  <CardHeader
                    title={w.name}
                    avatar={
                      <AvatarGroup>
                        {w.authors ? (
                          <>
                            {w.authors.map((a) => (
                              <Avatar key={a.userId} src={a.iconUrl} alt={a.name} />
                            ))}
                          </>
                        ) : (
                          ""
                        )}
                      </AvatarGroup>
                    }
                  ></CardHeader>
                  <CardContent>
                    <WorkCardPreview id={w.workId} />
                    {w.tags ? <ChipList chipList={w.tags.map((t) => t.name)} /> : ""}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        ) : (
          <p>Workがねぇ...</p>
        )}
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
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
export default WorkIndexPage;
