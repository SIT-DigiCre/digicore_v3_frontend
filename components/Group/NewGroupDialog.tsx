import { useState } from "react";

import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { apiClient } from "../../utils/fetch/client";

type NewGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const NewGroupDialog = ({ open, onClose, onSuccess }: NewGroupDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinable, setJoinable] = useState(true);
  const [isAdminGroup, setIsAdminGroup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();

  const handleClose = () => {
    if (isSubmitting) return;
    setName("");
    setDescription("");
    setJoinable(true);
    setIsAdminGroup(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setNewError({ name: "new-group-validation", message: "グループ名と説明を入力してください" });
      return;
    }

    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "new-group-auth", message: "ログインが必要です" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.POST("/group", {
        body: {
          name: name.trim(),
          description: description.trim(),
          joinable,
          isAdminGroup,
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.error) {
        const errorMessage =
          response.error.message || "グループの作成に失敗しました";
        setNewError({ name: "new-group-error", message: errorMessage });
        setIsSubmitting(false);
        return;
      }

      handleClose();
      onSuccess();
    } catch (error) {
      console.error("Error creating group:", error);
      setNewError({ name: "new-group-error", message: "グループの作成に失敗しました" });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>新規グループ作成</DialogTitle>
      <IconButton
        aria-label="グループ作成をやめる"
        onClick={handleClose}
        disabled={isSubmitting}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <TextField
              required
              label="グループ名"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              label="グループの説明"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={joinable}
                onChange={(e) => setJoinable(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="参加可能にする"
          />
          <FormHelperText>チェックを外すと、メンバーからの自発的な参加はできません</FormHelperText>

          <FormControlLabel
            control={
              <Checkbox
                checked={isAdminGroup}
                onChange={(e) => setIsAdminGroup(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="管理者グループにする"
          />
          <FormHelperText>
            管理者グループは管理者のみが作成でき、自発的な参加はできません
          </FormHelperText>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !description.trim()}
              startIcon={<Add />}
            >
              作成する
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupDialog;

