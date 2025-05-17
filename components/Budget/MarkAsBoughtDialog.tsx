import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};
export const MarkAsBoughtDialog = ({ open, onClose, onConfirm, name }: Props) => {
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
        <p>稟議「{name}」を購入済みに切り替えますか？</p>
        <p>変更後は元に戻すことができません！</p>
        <p>また購入済みにした稟議は削除できなくなります！</p>
        <p style={{ fontSize: "small" }}>
          <br />
          (変更後も支払いが行われるまでは購入金額・備考・領収書の修正は可能です)
        </p>
        <Button variant="contained" sx={{ marginY: 3 }} onClick={onConfirm}>
          購入済みにする
        </Button>
      </DialogContent>
    </Dialog>
  );
};
