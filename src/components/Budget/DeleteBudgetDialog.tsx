import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

type DeleteBudgetDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};

export const DeleteBudgetDialog = ({ open, onClose, onConfirm, name }: DeleteBudgetDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>削除操作の確認</DialogTitle>
      <IconButton
        aria-label="削除操作をキャンセルする"
        onClick={onClose}
        sx={{
          color: (theme) => theme.palette.grey[500],
          position: "absolute",
          right: 12,
          top: 12,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers sx={{ maxWidth: "400px" }}>
        <Typography>本当に稟議「{name}」を削除しますか？</Typography>
        <Typography>削除後は元に戻すことができません！</Typography>
        <Button variant="contained" color="error" sx={{ marginY: 3 }} onClick={onConfirm}>
          削除する
        </Button>
      </DialogContent>
    </Dialog>
  );
};
