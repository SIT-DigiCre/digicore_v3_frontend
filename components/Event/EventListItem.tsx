import Link from "next/link";

import { Card, CardContent } from "@mui/material";

import { DigicreEvent } from "../../interfaces/event";
import Heading from "../Common/Heading";
import MarkdownView from "../Markdown/MarkdownView";

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
      className="clickable-gray"
    >
      <CardContent>
        <Heading level={3}>{event.name}</Heading>
        <MarkdownView md={event.description ? event.description : ""} />
      </CardContent>
    </Card>
  );
};

export default EventListItem;
