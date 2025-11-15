import { useRouter } from "next/router";

import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Stack,
} from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import ChipList from "../../components/Common/ChipList";
import PageHead from "../../components/Common/PageHead";
import { WorkCardPreview } from "../../components/Work/WorkCardPreview";
import { useWorks } from "../../hook/work/useWork";

const WorkIndexPage = () => {
  const { works, loadMore } = useWorks();
  const router = useRouter();

  return (
    <>
      <PageHead title="作品一覧" />
      <Stack>
        <Stack spacing={2} my={2} direction="row" justifyContent="flex-end">
          <ButtonLink href="/work/new" startIcon={<AddIcon />}>
            投稿する
          </ButtonLink>
          <ButtonLink href="/work/mywork" startIcon={<PersonIcon />}>
            自分の作品を見る
          </ButtonLink>
        </Stack>
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
      </Stack>
      <Stack sx={{ textAlign: "center" }}>
        <Button onClick={() => loadMore()}>もっと見る</Button>
      </Stack>
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
