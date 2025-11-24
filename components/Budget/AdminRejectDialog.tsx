import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

type AdminRejectDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};

export const AdminRejectDialog = ({ open, onClose, onConfirm, name }: AdminRejectDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>却下操作の確認</DialogTitle>
      <IconButton
        aria-label="却下操作をキャンセルする"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers sx={{ textAlign: "center" }}>
        <Typography>稟議「{name}」を却下しますか？</Typography>
        <Typography>変更後は元に戻すことができません！</Typography>
        <Button variant="contained" color="error" sx={{ marginY: 3 }} onClick={onConfirm}>
          却下する
        </Button>
      </DialogContent>
    </Dialog>
  );
};
