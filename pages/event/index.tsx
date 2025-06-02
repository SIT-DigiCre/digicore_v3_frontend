import { Stack } from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import EventListItem from "../../components/Event/EventListItem";
import { useEventList } from "../../hook/event/useEventList";

const EventIndexPage = () => {
  const { isLoading, events } = useEventList();

  if (isLoading) return <p>Loading..</p>;

  return (
    <>
      <PageHead title="イベント一覧" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Event" }]} />
      <h1>イベント一覧</h1>
      <Stack spacing={2} my={2} direction="column">
        {events.map((event) => (
          <EventListItem key={event.eventId} event={event} />
        ))}
      </Stack>
    </>
  );
};

export default EventIndexPage;
