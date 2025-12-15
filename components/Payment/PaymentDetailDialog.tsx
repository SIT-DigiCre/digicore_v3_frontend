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

import { Payment } from "../../interfaces/payment";

type PaymentDetailDialogProps = {
  payment: Payment;
  open: boolean;
  onClose: () => void;
  onSave: (paymentId: string, checked: boolean, note: string) => Promise<boolean>;
};

const PaymentDetailDialog = ({ payment, open, onClose, onSave }: PaymentDetailDialogProps) => {
  const [checked, setChecked] = useState(payment.checked ?? false);
  const [note, setNote] = useState(payment.note);
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    if (!isPending) {
      setChecked(payment.checked ?? false);
      setNote(payment.note);
      onClose();
    }
  };

  const handleSave = async () => {
    startTransition(async () => {
      const success = await onSave(payment.paymentId, checked, note);
      if (success) {
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>支払い詳細</DialogTitle>
      <IconButton
        aria-label="ダイアログを閉じる"
        onClick={handleClose}
        disabled={isPending}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: (theme) => theme.palette.grey[500],
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
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>
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
