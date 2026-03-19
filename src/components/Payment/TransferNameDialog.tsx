import { useEffect, useState } from "react";

import { Close } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import { getFiscalYear } from "../../utils/date-util";

type TransferNameDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (transferName: string) => Promise<void>;
  initialTransferName: string;
};

const TransferNameDialog = ({
  open,
  onClose,
  onSubmit,
  initialTransferName,
}: TransferNameDialogProps) => {
  const [transferName, setTransferName] = useState(initialTransferName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTransferName(initialTransferName);
  }, [open, initialTransferName]);

  const handleSubmit = async () => {
    if (!transferName.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(transferName);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getFiscalYear(new Date())}年度 振込報告</DialogTitle>
      <IconButton
        aria-label="ダイアログを閉じる"
        onClick={onClose}
        disabled={isSubmitting}
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
        <TextField
          label="振込名義"
          helperText="ATMにて入力した振込名義（カタカナ）を記入してください"
          fullWidth
          value={transferName}
          onChange={(e) => setTransferName(e.target.value)}
          disabled={isSubmitting}
          required
          sx={{ mt: 1 }}
        />
        <Alert severity="warning" sx={{ mt: 2 }}>
          振込を終えた状態でこのフォームに回答してください
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || !transferName.trim()}
        >
          振込情報を更新する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferNameDialog;
