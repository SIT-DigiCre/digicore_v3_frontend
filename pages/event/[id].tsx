import type { InferGetServerSidePropsType } from "next";

import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, Stack, Typography } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import EventReservationFrame from "../../components/Event/EventReservationFrame";
import MarkdownView from "../../components/Markdown/MarkdownView";
import { createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ params, req }) => {
  if (!params?.id || typeof params.id !== "string") {
    return { props: { data: null } };
  }
  try {
    const client = createServerApiClient(req);
    const res = await client.GET("/event/{eventId}", {
      params: {
        path: {
          eventId: params.id,
        },
      },
    });
    return { props: { data: res.data || null } };
  } catch (e) {
    console.error(e);
    return { props: { data: null } };
  }
};

const EventPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!data) return <Typography>指定されたイベントが見つかりませんでした</Typography>;

  return (
    <>
      <PageHead title="イベント詳細" />
      <Stack mb={2} alignItems="flex-start">
        <ButtonLink href="/event" startIcon={<ArrowBack />} variant="text">
          イベント一覧に戻る
        </ButtonLink>
      </Stack>
      <Heading level={2}>{data.name}</Heading>
      {data.reservated && (
        <Alert severity="info" sx={{ mb: 2 }}>
          既にあなたは予約済みです
        </Alert>
      )}
      <MarkdownView md={data.description} />
      {data.reservations ? (
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          <Stack spacing={2} my={2} direction="column">
            {data.reservations
              .sort((a, b) =>
                new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? 1 : -1,
              )
              .map((frame) => (
                <EventReservationFrame
                  key={frame.reservationId}
                  eventId={data.eventId}
                  eventReservation={frame}
                />
              ))}
          </Stack>
        </Box>
      ) : (
        <Typography>枠はありません</Typography>
      )}
    </>
  );
};

export default EventPage;
