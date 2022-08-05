import { Card, CardContent } from "@mui/material";
import { useRouter } from "next/router";
import { DigicreEvent } from "../../interfaces/event";
import MarkdownView from "../Common/MarkdownView";

type Props = {
  event: DigicreEvent;
};
const EventListItem = ({ event }: Props) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/event/${event.id!}`);
  };
  return (
    <>
      <Card sx={{ margin: "3px" }} variant="outlined" onClick={onClick} className="clickable-gray">
        <CardContent>
          <h3>{event.name}</h3>
          <MarkdownView md={event.description} />
        </CardContent>
      </Card>
    </>
  );
};

export default EventListItem;
