import { GetServerSideProps } from "next";
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
    <>
      <h1>{eventDetail.name}イベント予約フォーム</h1>
      <p>{eventDetail.description}</p>
      {eventDetail.reservated ? <p style={{ color: "red" }}>既にあなたは予約済みです</p> : <></>}
      <hr />
      {eventDetail.reservation_frames.map((frame) => (
        <EventReservationFrame
          eventId={id}
          eventReservationFrame={frame}
          reservation={reservation}
          cancelReservation={cancelReservation}
        />
      ))}
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
