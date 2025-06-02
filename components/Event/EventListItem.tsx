import Link from "next/link";

import { Card, CardContent } from "@mui/material";

import { DigicreEvent } from "../../interfaces/event";
import MarkdownView from "../Common/MarkdownView";

type Props = {
  event: DigicreEvent;
};

const EventListItem = ({ event }: Props) => {
  return (
    <Card
      component={Link}
      href={`/event/${event.eventId!}`}
      sx={{ textDecoration: "none" }}
      variant="outlined"
    >
      <CardContent>
        <h3>{event.name}</h3>
        <MarkdownView md={event.description ? event.description : ""} />
      </CardContent>
    </Card>
  );
};

export default EventListItem;
