
import type { InferGetServerSidePropsType, NextApiRequest } from "next";

import { Stack } from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import EventListItem from "../../components/Event/EventListItem";
import { createServerApiClient } from "../../utils/fetch/client";


export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);
  try {
    const eventsRes = await client.GET("/event");
    if (!eventsRes.data || !eventsRes.data.events) {
      return { props: { events: [] } };
    }
    return { props: { events: eventsRes.data.events } };
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return { props: { events: [] } };
  }
};

const EventIndexPage = ({ events }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <PageHead title="イベント一覧" />
      <Stack spacing={2} my={2} direction="column">
        {events.map((event) => (
          <EventListItem key={event.eventId} event={event} />
        ))}
      </Stack>
    </>
  );
};

export default EventIndexPage;
