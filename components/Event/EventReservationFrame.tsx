import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";

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

import useEventUserReservationList from "../../hook/event/useEventUserReservationList";
import { useDarkMode } from "../../hook/useDarkMode";
import { DigicreEventReservation } from "../../interfaces/event";
import { getTimeSpanText } from "../../utils/date-util";

type Props = {
  eventId: string;
  eventReservation: DigicreEventReservation;
  reservation: (id: string, commentText: string, urlText: string) => Promise<boolean>;
  cancelReservation: (id: string) => Promise<boolean>;
};
const modalStyle = {
  position: "absolute" as const,
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
  eventReservation,
  reservation,
  cancelReservation,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [urlText, setUrlText] = useState("");
  const { isLoading, userReservations } = useEventUserReservationList(
    eventId,
    eventReservation.reservationId!,
  );
  const onChangeCommnetText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCommentText(e.target.value);
  };
  const onChangeUrlText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUrlText(e.target.value);
  };
  const { isDarkMode } = useDarkMode();
  const getBackgroudColor = () => {
    const finishDate = new Date(eventReservation.finishDate);
    const now = new Date(Date.now());
    if (finishDate.getTime() < now.getTime()) return "darkgray";
    if (
      finishDate.getDate() === now.getDate() &&
      finishDate.getMonth() === now.getMonth() &&
      finishDate.getFullYear() === now.getFullYear()
    )
      return isDarkMode ? "green" : "lightgreen";
    return "none";
  };
  return (
    <>
      <Card sx={{ minWidth: 275, backgroundColor: getBackgroudColor() }} variant="outlined">
        <CardContent>
          <Typography variant="h5">{eventReservation.name}</Typography>
          <Typography>{eventReservation.description}</Typography>
          <Typography>{`実施期間: ${getTimeSpanText(
            eventReservation.startDate,
            eventReservation.finishDate,
          )}`}</Typography>
          <Typography>{`予約実行可能期間: ${getTimeSpanText(
            eventReservation.reservationStartDate,
            eventReservation.reservationFinishDate,
          )}`}</Typography>
          {isLoading ? (
            <></>
          ) : (
            <div style={{ display: "inline-block" }}>
              {userReservations.map((userReservation) => (
                <Box
                  key={userReservation.userId!}
                  style={{ border: "black 1px solid", borderRadius: "5px", padding: "3px" }}
                >
                  <h5>{userReservation.name!}</h5>
                  {userReservation.comment === "" ? <></> : <p>{userReservation.comment}</p>}
                  {userReservation.url === "" ? (
                    <></>
                  ) : (
                    <a href={userReservation.url}>{userReservation.url}</a>
                  )}
                </Box>
              ))}
            </div>
          )}

          <Typography>
            残り予約数: {eventReservation.freeCapacity}/{eventReservation.capacity}
          </Typography>
        </CardContent>
        <CardActions>
          {eventReservation.reservated ? (
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => {
                cancelReservation(eventReservation.reservationId).then(() => {
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
              disabled={!eventReservation.reservable}
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
        aria-describedby={getTimeSpanText(eventReservation.startDate, eventReservation.finishDate)}
      >
        <Box sx={modalStyle}>
          <TextField onChange={onChangeCommnetText} value={commentText} label="コメント" />
          <TextField onChange={onChangeUrlText} value={urlText} label="添付URL" />
          <br />
          <Button
            onClick={() => {
              reservation(eventReservation.reservationId!, commentText, urlText).then(() => {
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
