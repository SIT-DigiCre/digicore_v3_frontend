import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  filesMissing?: boolean;
};
export const AdminPaidDialog = ({ open, onClose, onConfirm, name, filesMissing }: Props) => {
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
        {filesMissing && (
          <Typography
            color="error"
            sx={{
              marginBlock: "1em",
            }}
          >
            <p>この稟議には領収書が添付されていません。</p>
            <p>強制的に支払い完了操作を行うことは可能ですが、</p>
            <p>特別な事情がある場合を除き申請者が領収書を添付してから</p>
            <p>この操作を行うようにしてください。</p>
          </Typography>
        )}
        <Button variant="contained" sx={{ marginY: 3 }} onClick={onConfirm}>
          支払い完了にする
        </Button>
      </DialogContent>
    </Dialog>
  );
};
