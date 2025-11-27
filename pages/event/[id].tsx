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
    const eventRes = await client.GET("/event/{eventId}", {
      params: {
        path: {
          eventId: params.id,
        },
      },
    });
    // TODO: N+1問題を解消するため、バックエンドの実装を変更する
    const eventReservationsRes = await Promise.all(
      eventRes.data.reservations.map(async (reservation) => {
        return client.GET("/event/{eventId}/{reservationId}", {
          params: {
            path: {
              eventId: params.id,
              reservationId: reservation.reservationId,
            },
          },
        });
      }),
    );
    const eventReservations = eventRes.data.reservations.map((reservation) => {
      return {
        ...reservation,
        users: eventReservationsRes.find(
          (res) => res.data.reservationId === reservation.reservationId,
        )?.data.users,
      };
    });
    return {
      props: {
        event: {
          ...eventRes.data,
          reservations: eventReservations,
        },
      },
    };
  } catch (e) {
    console.error(e);
    return { props: { data: null } };
  }
};

const EventPage = ({ event }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!event) return <Typography>指定されたイベントが見つかりませんでした</Typography>;

  return (
    <>
      <PageHead title="イベント詳細" />
      <Stack mb={2} alignItems="flex-start">
        <ButtonLink href="/event" startIcon={<ArrowBack />} variant="text">
          イベント一覧に戻る
        </ButtonLink>
      </Stack>
      <Heading level={2}>{event.name}</Heading>
      {event.reservated && (
        <Alert severity="info" sx={{ mb: 2 }}>
          既にあなたは予約済みです
        </Alert>
      )}
      <MarkdownView md={event.description} />
      {event.reservations ? (
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          <Stack spacing={2} my={2} direction="column">
            {event.reservations
              .sort((a, b) =>
                new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? 1 : -1,
              )
              .map((frame) => (
                <EventReservationFrame
                  key={frame.reservationId}
                  eventId={event.eventId}
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
