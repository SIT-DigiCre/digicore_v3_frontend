import { Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MarkdownView from "../../components/Common/MarkdownView";
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
      {eventDetail.reservation_frames
        .sort((a, b) =>
          new Date(a.start_date).getTime() > new Date(b.start_date).getTime() ? 1 : -1,
        )
        .map((frame) => (
          <EventReservationFrame
            key={frame.id!}
            eventId={id}
            eventReservationFrame={frame}
            reservation={reservation}
            cancelReservation={cancelReservation}
          />
        ))}
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
