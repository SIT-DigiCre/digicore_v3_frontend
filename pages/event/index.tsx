import { Container } from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import EventListItem from "../../components/Event/EventListItem";
import { useEventList } from "../../hook/event/useEventList";

const EventIndexPage = () => {
  const { isLoading, events } = useEventList();
  if (isLoading) return <p>Loading..</p>;
  return (
    <Container>
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Event" }]} />
      <h1>イベント一覧</h1>
      <p>イベント一覧から参加するイベントを探してください。</p>
      <hr />
      {events.map((event) => (
        <EventListItem event={event} />
      ))}
    </Container>
  );
};

export default EventIndexPage;
