import { useRouter } from "next/router";
import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const router = useRouter();

  const checkInChanged = checkIn !== initialCheckIn;
  const checkOutChanged = checkOut !== initialCheckOut;

  const handleSave = async () => {
    if (!authState.token) return;

    if (checkOut && dayjs(checkOut).isBefore(dayjs(checkIn))) {
      setValidationError("チェックアウト時刻はチェックイン時刻より後にしてください");
      return;
    }

    setValidationError("");
    setLoading(true);

    try {
      const updates: { activity_type: "checkin" | "checkout"; time: string }[] = [];
      if (checkInChanged) {
        updates.push({ activity_type: "checkin", time: dayjs(checkIn).toISOString() });
      }
      if (checkOutChanged && checkOut) {
        updates.push({ activity_type: "checkout", time: dayjs(checkOut).toISOString() });
      }

      for (const update of updates) {
        const { error } = await apiClient.PUT("/activity/record/{recordId}", {
          body: update,
          headers: { Authorization: `Bearer ${authState.token}` },
          params: { path: { recordId } },
        });
        if (error) {
          setNewError({ message: "記録の更新に失敗しました", name: "edit-record-fail" });
          setLoading(false);
          return;
        }
      }

      removeError("edit-record-fail");
      onClose();
      router.reload();
    } catch {
      setNewError({ message: "記録の更新に失敗しました", name: "edit-record-fail" });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = checkInChanged || checkOutChanged;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ alignItems: "center", display: "flex", gap: 1 }}>
        <AccessTimeIcon />
        記録を編集
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
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
          {validationError && <Alert severity="error">{validationError}</Alert>}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !hasChanges}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRecordDialog;
