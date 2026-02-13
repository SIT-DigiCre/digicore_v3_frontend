import { useRouter } from "next/router";
import { useEffect, useState, useTransition } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";

import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { apiClient } from "@/utils/fetch/client";

type EditRecordDialogProps = {
  open: boolean;
  onClose: () => void;
  recordId: string;
  checkedInAt: string;
  checkedOutAt: string | null | undefined;
};

const toDatetimeLocalValue = (iso: string) => dayjs(iso).format("YYYY-MM-DDTHH:mm");

const EditRecordDialog = ({
  open,
  onClose,
  recordId,
  checkedInAt,
  checkedOutAt,
}: EditRecordDialogProps) => {
  const initialCheckIn = toDatetimeLocalValue(checkedInAt);
  const initialCheckOut = checkedOutAt ? toDatetimeLocalValue(checkedOutAt) : "";

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [checkInPending, startCheckInTransition] = useTransition();
  const [checkOutPending, startCheckOutTransition] = useTransition();
  const [validationError, setValidationError] = useState("");
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const router = useRouter();

  const checkInChanged = checkIn !== initialCheckIn;
  const checkOutChanged = checkOut !== initialCheckOut;
  const isPending = checkInPending || checkOutPending;

  useEffect(() => {
    if (open) {
      setCheckIn(toDatetimeLocalValue(checkedInAt));
      setCheckOut(checkedOutAt ? toDatetimeLocalValue(checkedOutAt) : "");
      setValidationError("");
    }
  }, [open, checkedInAt, checkedOutAt]);

  const updateRecord = async (activityType: "checkin" | "checkout", time: string) => {
    if (!authState.token) return;

    const { error } = await apiClient.PUT("/activity/record/{recordId}", {
      body: { activity_type: activityType, time },
      headers: { Authorization: `Bearer ${authState.token}` },
      params: { path: { recordId } },
    });

    if (error) {
      setNewError({
        message: `${activityType === "checkin" ? "チェックイン" : "チェックアウト"}時刻の更新に失敗しました`,
        name: `edit-record-${activityType}-fail`,
      });
      return;
    }

    removeError(`edit-record-${activityType}-fail`);
    router.replace(router.asPath);
  };

  const handleCheckInSave = () => {
    if (checkOut && dayjs(checkOut).isBefore(dayjs(checkIn))) {
      setValidationError("チェックアウト時刻はチェックイン時刻より後にしてください");
      return;
    }
    setValidationError("");
    startCheckInTransition(async () => {
      await updateRecord("checkin", dayjs(checkIn).toISOString());
    });
  };

  const handleCheckOutSave = () => {
    if (checkOut && dayjs(checkOut).isBefore(dayjs(checkIn))) {
      setValidationError("チェックアウト時刻はチェックイン時刻より後にしてください");
      return;
    }
    setValidationError("");
    startCheckOutTransition(async () => {
      await updateRecord("checkout", dayjs(checkOut).toISOString());
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ alignItems: "center", display: "flex", gap: 1 }}>
        <AccessTimeIcon />
        記録を編集
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Stack spacing={1}>
            <TextField
              label="チェックイン"
              type="datetime-local"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setValidationError("");
              }}
              fullWidth
              helperText={`元の時刻: ${dayjs(checkedInAt).format("HH:mm")}`}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCheckInSave}
              disabled={isPending || !checkInChanged}
              startIcon={
                checkInPending ? <CircularProgress size={16} color="inherit" /> : undefined
              }
              sx={{ alignSelf: "flex-end" }}
            >
              チェックインを更新
            </Button>
          </Stack>
          <Stack spacing={1}>
            <TextField
              label="チェックアウト"
              type="datetime-local"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setValidationError("");
              }}
              fullWidth
              disabled={!checkedOutAt}
              helperText={
                !checkedOutAt
                  ? "チェックアウト前のため編集できません"
                  : `元の時刻: ${dayjs(checkedOutAt).format("HH:mm")}`
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCheckOutSave}
              disabled={isPending || !checkOutChanged || !checkedOutAt}
              startIcon={
                checkOutPending ? <CircularProgress size={16} color="inherit" /> : undefined
              }
              sx={{ alignSelf: "flex-end" }}
            >
              チェックアウトを更新
            </Button>
          </Stack>
          {validationError && <Alert severity="error">{validationError}</Alert>}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRecordDialog;
