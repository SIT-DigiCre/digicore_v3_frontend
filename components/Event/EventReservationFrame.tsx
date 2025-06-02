import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";

import { Add, Cancel, OpenInNew } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import useEventUserReservationList from "../../hook/event/useEventUserReservationList";
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

  const isReservableDatetime =
    eventReservation.reservationStartDate <= new Date() &&
    eventReservation.reservationFinishDate >= new Date() &&
    eventReservation.finishDate > new Date();

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          title={eventReservation.name}
          subheader={getTimeSpanText(eventReservation.startDate, eventReservation.finishDate)}
          sx={{ pb: 0 }}
        />
        <CardContent>
          <Typography>{eventReservation.description}</Typography>
          {!isLoading && userReservations.length > 0 ? (
            <List>
              {userReservations.map((userReservation) => (
                <ListItem
                  key={userReservation.userId!}
                  secondaryAction={
                    userReservation.url.startsWith("http") && (
                      <IconButton
                        aria-label="リンクを開く"
                        component="a"
                        href={userReservation.url}
                      >
                        <OpenInNew />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon>
                    <Avatar src={userReservation.userIcon}>{userReservation.name.charAt(0)}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={userReservation.name}
                    secondary={userReservation.comment}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p>予約者がいません</p>
          )}
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0, gap: 2, alignItems: "center" }}>
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
              startIcon={<Cancel />}
            >
              キャンセルする
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              disabled={!eventReservation.reservable && !isReservableDatetime}
              onClick={() => setShowModal(true)}
              startIcon={<Add />}
            >
              予約する
            </Button>
          )}
          <Typography>
            {(userReservations || []).length} / {eventReservation.capacity}人
          </Typography>
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
