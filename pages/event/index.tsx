import { Stack } from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import EventListItem from "../../components/Event/EventListItem";
import { useEventList } from "../../hook/event/useEventList";

const EventIndexPage = () => {
  const { isLoading, events } = useEventList();

  if (isLoading) return <p>読み込み中...</p>;

  return (
    <>
      <PageHead title="イベント一覧" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Event" }]} />
      <Heading level={1}>イベント一覧</Heading>
      <Stack spacing={2} my={2} direction="column">
        {events.map((event) => (
          <EventListItem key={event.eventId} event={event} />
        ))}
      </Stack>
    </>
  );
};

export default EventIndexPage;
