import { useRouter } from "next/router";
import { DigicreEvent } from "../../interfaces/event";

type Props = {
  event: DigicreEvent;
};
const EventListItem = ({ event }: Props) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/event/${event.id!}`);
  };
  return (
    <div onClick={onClick}>
      <h3>{event.name}</h3>
      <p>{event.description}</p>
    </div>
  );
};

export default EventListItem;
