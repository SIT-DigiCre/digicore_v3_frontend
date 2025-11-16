import Link from "next/link";

import { Add, FilterList } from "@mui/icons-material";
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

const MyWorkPage = () => {
  const { works, loadMore, isOver } = useWorks("my");

  return (
    <>
      <PageHead title="自分の作品" />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<FilterList />} variant="text">
          作品一覧を見る
        </ButtonLink>
        <ButtonLink href="/work/new" startIcon={<Add />}>
          投稿する
        </ButtonLink>
      </Stack>
      <Stack spacing={2}>
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
                  >
                    <CardHeader
                      title={w.name}
                      avatar={
                        <AvatarGroup>
                          {w.authors.map((a) => (
                            <Avatar key={a.userId} src={a.iconUrl} alt={a.username} />
                          ))}
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

export default MyWorkPage;
