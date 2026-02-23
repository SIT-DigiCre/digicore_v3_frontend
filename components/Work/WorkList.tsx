import Link from "next/link";

import { Avatar, AvatarGroup, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

import ChipList from "../Common/ChipList";
import { WorkCardPreview } from "./WorkCardPreview";

import type { WorkDetail } from "../../interfaces/work";

interface WorkListProps {
  works: WorkDetail[];
}

export const WorkList = ({ works }: WorkListProps) => {
  return (
    <Grid container>
      {works && works.length > 0 ? (
        <>
          {works.map((w) => (
            <Grid key={w.workId} size={[12, 6, 4]} sx={{ padding: 0.5 }}>
              <Card
                sx={{
                  color: "inherit",
                  display: "inline-block",
                  height: "100%",
                  m: 0.5,
                  textDecoration: "none",
                  width: "100%",
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
                  <WorkCardPreview description={w.description} files={w.files} />
                  {w.tags && <ChipList chipList={w.tags.map((t) => t.name)} />}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </>
      ) : (
        <Typography my={2}>
          作品が登録されていません。
          <Link href="/work/">作品ページ</Link>から投稿してみましょう！
        </Typography>
      )}
    </Grid>
  );
};
