import Link from "next/link";

import { FilterList } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
} from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import ChipList from "../../components/Common/ChipList";
import PageHead from "../../components/Common/PageHead";
import { WorkCardPreview } from "../../components/Work/WorkCardPreview";
import { useWorks } from "../../hook/work/useWork";

const WorkIndexPage = () => {
  const { works, loadMore, isOver } = useWorks();

  return (
    <>
      <PageHead title="作品一覧" />
      <Stack spacing={2}>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <ButtonLink href="/work/mywork" startIcon={<FilterList />} variant="text">
            自分の作品を見る
          </ButtonLink>
          <ButtonLink href="/work/new" startIcon={<AddIcon />}>
            投稿する
          </ButtonLink>
        </Stack>
        <Grid container>
          {works ? (
            <>
              {works.map((w) => (
                <Grid key={w.workId} size={[12, 6, 4]} sx={{ padding: 0.5 }}>
                  <Card
                    sx={{
                      width: "100%",
                      display: "inline-block",
                      m: 0.5,
                      height: "100%",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    component={Link}
                    href={`/work/${w.workId}`}
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
                                <Avatar key={a.userId} src={a.iconUrl} alt={a.username} />
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
                      {w.tags && <ChipList chipList={w.tags.map((t) => t.name)} />}
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
      {!isOver && (
        <Stack alignItems="center" my={2}>
          <Button onClick={() => loadMore()}>もっと見る</Button>
        </Stack>
      )}
    </>
  );
};
export default WorkIndexPage;
