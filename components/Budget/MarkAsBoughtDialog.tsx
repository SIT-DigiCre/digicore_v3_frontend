import { Check, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

type MarkAsBoughtDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
};

export const MarkAsBoughtDialog = ({ open, onClose, onConfirm, name }: MarkAsBoughtDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>切り替え操作の確認</DialogTitle>
      <IconButton
        aria-label="切り替え操作をキャンセルする"
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
        <Typography>稟議「{name}」を購入済みに切り替えますか？</Typography>
        <Typography color="error">
          変更後は元に戻すことができません。さらに、購入済みにした稟議は削除できなくなります。
        </Typography>
        <Typography mt={2}>
          変更後も支払いが行われるまでは購入金額・備考・領収書の修正は可能です。
        </Typography>
        <Stack direction="row" justifyContent="flex-end" my={2}>
          <Button variant="contained" onClick={onConfirm} startIcon={<Check />}>
            購入済みにする
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
