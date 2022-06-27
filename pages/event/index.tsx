import EventListItem from "../../components/Event/EventListItem";
import { useEventList } from "../../hook/event/useEventList";

const EventIndexPage = () => {
  const { isLoading, events } = useEventList();
  if (isLoading) return <p>Loading..</p>;
  return (
    <>
      <h1>イベント一覧</h1>
      {events.map((event) => (
        <EventListItem event={event} />
      ))}
    </>
  );
};

export default EventIndexPage;
