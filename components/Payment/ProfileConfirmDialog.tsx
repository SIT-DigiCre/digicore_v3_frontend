import Link from "next/link";

import { CheckCircle, ContactEmergency, Person } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

type ProfileConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
};

const ProfileConfirmDialog = ({ open, onClose }: ProfileConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ alignItems: "center", display: "flex", gap: 1 }}>
        <CheckCircle color="success" />
        振込報告が完了しました
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          本人情報・緊急連絡先が最新か確認してください。
        </Typography>
        <List disablePadding>
          <ListItemButton component={Link} href="/user/profile/personal">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="本人情報を確認する" />
          </ListItemButton>
          <ListItemButton component={Link} href="/user/profile/emergency">
            <ListItemIcon>
              <ContactEmergency />
            </ListItemIcon>
            <ListItemText primary="緊急連絡先を確認する" />
          </ListItemButton>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileConfirmDialog;
