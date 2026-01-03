import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

type AdminApproveDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};

export const AdminApproveDialog = ({ open, onClose, onConfirm, name }: AdminApproveDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>承認操作の確認</DialogTitle>
      <IconButton
        aria-label="承認操作をキャンセルする"
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
      <DialogContent dividers sx={{ maxWidth: "400px" }}>
        <Typography>稟議「{name}」を承認しますか？</Typography>
        <Typography>変更後は元に戻すことができません！</Typography>
        <Button variant="contained" color="success" sx={{ marginY: 3 }} onClick={onConfirm}>
          承認する
        </Button>
      </DialogContent>
    </Dialog>
  );
};
