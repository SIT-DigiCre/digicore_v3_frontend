import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};
export const AdminPaidDialog = ({ open, onClose, onConfirm, name }: Props) => {
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
        <p>稟議「{name}」を支払い完了に切り替えますか？</p>
        <p>変更後は元に戻すことができません！</p>
        <Button variant="contained" sx={{ marginY: 3 }} onClick={onConfirm}>
          支払い完了にする
        </Button>
      </DialogContent>
    </Dialog>
  );
};
