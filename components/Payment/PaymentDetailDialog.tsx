import { useRouter } from "next/router";
import { useState, useTransition } from "react";

import { Close, Save } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { Payment } from "../../interfaces/payment";
import { apiClient } from "../../utils/fetch/client";
import { useErrorState } from "../contexts/ErrorStateContext";

type PaymentDetailDialogProps = {
  payment: Payment;
  open: boolean;
  onClose: () => void;
};

const PaymentDetailDialog = ({ payment, open, onClose }: PaymentDetailDialogProps) => {
  const router = useRouter();
  const [checked, setChecked] = useState(payment.checked ?? false);
  const [note, setNote] = useState(payment.note);
  const [isPending, startTransition] = useTransition();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const handleSave = async () => {
    startTransition(async () => {
      try {
        await apiClient.PUT(`/payment/{paymentId}`, {
          body: { checked: checked, note: note },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
          params: {
            path: {
              paymentId: payment.paymentId,
            },
          },
        });
        removeError("payments-update-fail");
        await router.replace(router.asPath);
        onClose();
      } catch {
        setNewError({
          message: "支払情報の更新に失敗しました",
          name: "payments-update-fail",
        });
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>支払い詳細</DialogTitle>
      <IconButton
        aria-label="ダイアログを閉じる"
        onClick={onClose}
        disabled={isPending}
        sx={{
          color: (theme) => theme.palette.grey[500],
          position: "absolute",
          right: 12,
          top: 12,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              支払い番号
            </Typography>
            <Typography variant="body1">{payment.paymentId}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              学籍番号
            </Typography>
            <Typography variant="body1">{payment.studentNumber}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              支払い名義
            </Typography>
            <Typography variant="body1">{payment.transferName}</Typography>
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                disabled={isPending}
              />
            }
            label="確認済み"
          />

          <TextField
            label="備考"
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isPending}
          />

          <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={onClose} disabled={isPending}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isPending || (payment.checked === checked && note === payment.note)}
              startIcon={<Save />}
            >
              保存
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailDialog;
