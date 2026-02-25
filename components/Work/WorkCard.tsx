import Link from "next/link";
import { WorkDetail } from "../../interfaces/work";

import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  CardHeader,
  Grid
} from "@mui/material";

import ChipList from "../Common/ChipList";
import { WorkCardPreview } from "./WorkCardPreview";


interface WorkCardProps {
  work: WorkDetail
}

export const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <Grid key={work.workId} size={[12, 6, 4]} sx={{ padding: 0.5 }}>
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
        href={`/work/${work.workId}`}
        className="clickable-gray"
      >
        <CardHeader
          title={work.name}
          avatar={
            <AvatarGroup>
              {work.authors.map((a) => (
                <Avatar key={a.userId} src={a.iconUrl} alt={a.username} />
              ))}
            </AvatarGroup>
          }
        ></CardHeader>
        <CardContent>
          <WorkCardPreview description={work.description} files={work.files} />
          {work.tags && <ChipList chipList={work.tags.map((t) => t.name)} />}
        </CardContent>
      </Card>
    </Grid>
  );
};
