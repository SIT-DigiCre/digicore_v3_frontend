import {
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useWorks } from "../../hook/work/useWork";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import PageHead from "../../components/Common/PageHead";

const MyWorkPage = () => {
  const router = useRouter();
  const { works, deleteWork } = useWorks("my");
  return (
    <Container>
      <PageHead title="MyWork" />
      <Breadcrumbs
        links={[{ text: "Home", href: "/" }, { text: "Work", href: "/work" }, { text: "MyWork" }]}
      />
      <Grid>
        <div>
          <h1 className="d-inlineblock">My Work</h1>
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
            {/* <Button
              variant="contained"
              sx={{ margin: "0.1rem" }}
              onClick={() => {
                router.push(`/work/tag`);
              }}
            >
              WorkTag一覧
            </Button> */}
          </div>
        </div>
        <hr style={{ clear: "both" }} />
      </Grid>
      <Grid>
        <List sx={{ bgcolor: "background.paper", width: "100%" }} disablePadding>
          {works ? (
            <>
              {works.map((w) => (
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={() => {
                          router.push(`/work/${w.workId}?mode=edit`);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={() => {
                          const res = confirm(`${w.name}を本当に削除しますか？`);
                          if (res)
                            deleteWork(w.workId).then((res) => {
                              if (!res) return;
                              router.reload();
                            });
                        }}
                        sx={{ marginLeft: 2 }}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      router.push(`/work/${w.workId}`);
                    }}
                  >
                    <ListItemText primary={w.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <ListItem>
              <ListItemText>
                まだあなたのWorkはありません。作品を作ってどんどん登録していこう!!
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Grid>
    </Container>
  );
};

export default MyWorkPage;
