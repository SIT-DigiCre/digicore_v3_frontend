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
    <div onClick={onClick} className="clickable">
      <h3>{event.name}</h3>
      <MarkdownView md={event.description} />
    </div>
  );
};

export default EventListItem;
