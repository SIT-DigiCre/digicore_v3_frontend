import { Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MarkdownView from "../../components/Common/MarkdownView";
import PageHead from "../../components/Common/PageHead";
import EventReservationFrame from "../../components/Event/EventReservationFrame";
import useEventDetail from "../../hook/event/useEventDetail";

type EventPageProps = {
  id?: string;
  errors?: any;
};
const EventPage = ({ id, errors }: EventPageProps) => {
  const { isLoading, notFound, eventDetail, reservation, cancelReservation } = useEventDetail(id);
  if (notFound) return <p>指定されたイベントが見つかりませんでした</p>;
  if (isLoading) return <p>Loading...</p>;
  return (
    <Container>
      <PageHead title={eventDetail.name} />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: "Event", href: "/event" },
          { text: eventDetail.name },
        ]}
      />
      <h1>{eventDetail.name}イベント予約フォーム</h1>
      <MarkdownView md={eventDetail.description} />
      {eventDetail.reservated ? <p style={{ color: "red" }}>既にあなたは予約済みです</p> : <></>}
      <hr />
      {eventDetail.reservation ? (
        <>
          {eventDetail.reservation
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
    </Container>
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
