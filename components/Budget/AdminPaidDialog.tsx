import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

type AdminPaidDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  filesMissing?: boolean;
};

export const AdminPaidDialog = ({
  open,
  onClose,
  onConfirm,
  name,
  filesMissing,
}: AdminPaidDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>操作の確認</DialogTitle>
      <IconButton
        aria-label="close"
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
        <Typography>稟議「{name}」を支払い完了に切り替えますか？</Typography>
        <Typography>変更後は元に戻すことができません！</Typography>
        {filesMissing && (
          <Box my={2}>
            <Typography color="error">この稟議には領収書が添付されていません。</Typography>
            <Typography color="error">
              強制的に支払い完了操作を行うことは可能ですが、特別な事情がある場合を除き申請者が領収書を添付してからこの操作を行うようにしてください。
            </Typography>
          </Box>
        )}
        <Button variant="contained" sx={{ marginY: 3 }} onClick={onConfirm}>
          支払い完了にする
        </Button>
      </DialogContent>
    </Dialog>
  );
};
