import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";
import useEventUserReservationList from "../../hook/event/useEventUserReservationList";
import { DigicreEventReservationFrame } from "../../interfaces/event";
import { getTimeSpanText } from "../../utils/date-util";

type Props = {
  eventId: string;
  eventReservationFrame: DigicreEventReservationFrame;
  reservation: (id: string, commentText: string, urlText: string) => Promise<boolean>;
  cancelReservation: (id: string) => Promise<boolean>;
};
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EventReservationFrame = ({
  eventId,
  eventReservationFrame,
  reservation,
  cancelReservation,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [urlText, setUrlText] = useState("");
  const { isLoading, userReservations } = useEventUserReservationList(
    eventId,
    eventReservationFrame.id!,
  );
  const onChangeCommnetText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCommentText(e.target.value);
  };
  const onChangeUrlText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUrlText(e.target.value);
  };
  const getBackgroudColor = () => {
    const finishDate = new Date(eventReservationFrame.finish_date);
    const now = new Date(Date.now());
    if (finishDate.getTime() < now.getTime()) return "darkgray";
    if (
      finishDate.getDate() === now.getDate() &&
      finishDate.getMonth() === now.getMonth() &&
      finishDate.getFullYear() === now.getFullYear()
    )
      return "lightgreen";
    return "white";
  };
  return (
    <>
      <Card
        sx={{ minWidth: 275, margin: "3px", backgroundColor: getBackgroudColor() }}
        variant="outlined"
      >
        <CardContent>
          <Typography variant="h5">{eventReservationFrame.name}</Typography>
          <Typography>{eventReservationFrame.description}</Typography>
          <Typography>{`実施期間: ${getTimeSpanText(
            eventReservationFrame.start_date,
            eventReservationFrame.finish_date,
          )}`}</Typography>
          <Typography>{`予約実行可能期間: ${getTimeSpanText(
            eventReservationFrame.reservation_start_date,
            eventReservationFrame.reservation_finish_date,
          )}`}</Typography>
          {isLoading ? (
            <></>
          ) : (
            <div style={{ display: "inline-block" }}>
              {userReservations.map((userReser) => (
                <Box
                  key={userReser.id!}
                  style={{ border: "black 1px solid", borderRadius: "5px", padding: "3px" }}
                >
                  <h5>{userReser.name!}</h5>
                  {userReser.comment === "" ? <></> : <p>{userReser.comment}</p>}
                  {userReser.url === "" ? <></> : <a href={userReser.url}>{userReser.url}</a>}
                </Box>
              ))}
            </div>
          )}

          <Typography>
            残り予約数: {eventReservationFrame.free_capacity}/{eventReservationFrame.capacity}
          </Typography>
        </CardContent>
        <CardActions>
          {eventReservationFrame.reservated ? (
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => {
                cancelReservation(eventReservationFrame.id).then((res) => {
                  router.reload();
                });
              }}
            >
              イベント予約をキャンセル
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              disabled={!eventReservationFrame.reservable}
              onClick={() => setShowModal(true)}
            >
              この枠を予約
            </Button>
          )}
        </CardActions>
      </Card>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        aria-labelledby="イベント枠予約"
        aria-describedby={getTimeSpanText(
          eventReservationFrame.start_date,
          eventReservationFrame.finish_date,
        )}
      >
        <Box sx={modalStyle}>
          <TextField onChange={onChangeCommnetText} value={commentText} label="コメント" />
          <TextField onChange={onChangeUrlText} value={urlText} label="添付URL" />
          <br />
          <Button
            onClick={() => {
              reservation(eventReservationFrame.id!, commentText, urlText).then((res) => {
                router.reload();
              });
            }}
          >
            予約する
          </Button>
          <Button onClick={() => setShowModal(false)}>キャンセル</Button>
        </Box>
      </Modal>
    </>
  );
};

export default EventReservationFrame;
