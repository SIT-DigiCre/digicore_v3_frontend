import { useEventList } from "../../hook/event/useEventList";

const EventIndexPage = () => {
  const { isLoading, events } = useEventList();
  if (isLoading) return <p>Loading..</p>;
  return (
    <>
      {events.map((event) => (
        <p>{event.name}</p>
      ))}
    </>
  );
};

export default EventIndexPage;
