import { GetServerSideProps } from "next";

import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import Heading from "../../components/Common/Heading";
import MarkdownView from "../../components/Common/MarkdownView";
import PageHead from "../../components/Common/PageHead";
import EventReservationFrame from "../../components/Event/EventReservationFrame";
import useEventDetail from "../../hook/event/useEventDetail";

type EventPageProps = {
  id?: string;
};
const EventPage = ({ id }: EventPageProps) => {
  const { isLoading, notFound, eventDetail, reservation, cancelReservation } = useEventDetail(id);

  if (notFound) return <p>指定されたイベントが見つかりませんでした</p>;
  if (isLoading) return <p>読み込み中...</p>;

  return (
    <>
      <PageHead title="イベント詳細" />
      <Stack mb={2} alignItems="flex-start">
        <ButtonLink href="/event" startIcon={<ArrowBack />} variant="text">
          イベント一覧に戻る
        </ButtonLink>
      </Stack>
      <Heading level={2}>{eventDetail.name}</Heading>
      {eventDetail.reservated && (
        <Alert severity="info" sx={{ mb: 2 }}>
          既にあなたは予約済みです
        </Alert>
      )}
      <MarkdownView md={eventDetail.description} />
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Stack spacing={2} my={2} direction="column">
          {eventDetail.reservations ? (
            <>
              {eventDetail.reservations
                .sort((a, b) =>
                  new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? 1 : -1,
                )
                .map((frame) => (
                  <EventReservationFrame
                    key={frame.reservationId!}
                    eventId={id}
                    eventReservation={frame}
                    reservation={reservation}
                    cancelReservation={cancelReservation}
                  />
                ))}
            </>
          ) : (
            <p>枠はありません</p>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default EventPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    return { props: { id } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
