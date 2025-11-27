import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";

import { Add, Cancel, OpenInNew } from "@mui/icons-material";
import {
  Avatar,
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
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { getTimeSpanText } from "../../utils/date-util";
import { apiClient } from "../../utils/fetch/client";

import type { DigicreEventReservation } from "../../interfaces/event";

type EventReservationFrameProps = {
  eventId: string;
  eventReservation: DigicreEventReservation;
};

const EventReservationFrame = ({ eventId, eventReservation }: EventReservationFrameProps) => {
  const { authState } = useAuthState();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setNewError } = useErrorState();

  const onChangeCommentText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCommentText(e.target.value);
  };
  const onChangeUrlText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUrlText(e.target.value);
  };

  const now = dayjs();
  const reservationStartDate = dayjs(eventReservation.reservationStartDate);
  const reservationFinishDate = dayjs(eventReservation.reservationFinishDate);
  const finishDate = dayjs(eventReservation.finishDate);

  const isReservable = () => {
    return (
      reservationStartDate.isBefore(now) &&
      reservationFinishDate.isAfter(now) &&
      finishDate.isAfter(now) &&
      eventReservation.reservable
    );
  };

  const cancelReservation = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.DELETE("/event/{eventId}/{reservationId}/me", {
        params: {
          path: {
            eventId,
            reservationId: eventReservation.reservationId,
          },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.error) {
        setNewError({
          name: "event-reservation-cancel-fail",
          message: res.error.message,
        });
      } else {
        router.reload();
      }
    } catch {
      setNewError({
        name: "event-reservation-cancel-fail",
        message: "イベント予約のキャンセルに失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reservation = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.PUT("/event/{eventId}/{reservationId}/me", {
        params: {
          path: {
            eventId,
            reservationId: eventReservation.reservationId,
          },
        },
        body: {
          comment: commentText,
          url: urlText,
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.error) {
        setNewError({
          name: "event-reservation-fail",
          message: res.error.message,
        });
      } else {
        router.reload();
      }
    } catch {
      setNewError({
        name: "event-reservation-fail",
        message: "イベント予約に失敗しました",
      });
    } finally {
      setShowModal(false);
      setIsLoading(false);
    }
  };

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
          {eventReservation.users.length > 0 ? (
            <List>
              {eventReservation.users.map((userReservation) => (
                <ListItem
                  key={userReservation.userId}
                  secondaryAction={
                    userReservation.url.startsWith("http") && (
                      <IconButton
                        aria-label="リンクを開く"
                        component="a"
                        href={userReservation.url}
                        target="_blank"
                        rel="noopener noreferrer"
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
            <Typography>予約者がいません</Typography>
          )}
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0, gap: 2, alignItems: "center" }}>
          {eventReservation.reservated ? (
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={cancelReservation}
              startIcon={<Cancel />}
              disabled={isLoading}
            >
              キャンセルする
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              disabled={!isReservable()}
              onClick={() => setShowModal(true)}
              startIcon={<Add />}
            >
              予約する
            </Button>
          )}
          <Typography>
            {eventReservation.users.length} / {eventReservation.capacity}人
          </Typography>
        </CardActions>
      </Card>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Paper
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            maxWidth: 700,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: "none",
          }}
          elevation={8}
        >
          <Stack spacing={2} direction="column" p={3}>
            <Stack spacing={2} direction="column">
              <TextField onChange={onChangeCommentText} value={commentText} label="コメント" />
              <TextField onChange={onChangeUrlText} value={urlText} label="添付URL" />
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button onClick={() => setShowModal(false)}>キャンセル</Button>
              <Button
                onClick={reservation}
                variant="contained"
                startIcon={<Add />}
                disabled={isLoading}
              >
                予約する
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};

export default EventReservationFrame;
