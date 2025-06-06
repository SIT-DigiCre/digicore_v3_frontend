import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};
export const DeleteBudgetDialog = ({ open, onClose, onConfirm, name }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>操作の確認</DialogTitle>
      <IconButton
        aria-label="close"
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
        <p>本当に稟議「{name}」を削除しますか？</p>
        <p>削除後は元に戻すことができません！</p>
        <Button variant="contained" color="error" sx={{ marginY: 3 }} onClick={onConfirm}>
          削除する
        </Button>
      </DialogContent>
    </Dialog>
  );
};
