import { useState } from "react";

import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { apiClient } from "../../utils/fetch/client";

type DeleteUserDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId: string;
  userId: string;
  userName: string;
};

const DeleteUserDialog = ({
  open,
  onClose,
  onSuccess,
  groupId,
  userId,
  userName,
}: DeleteUserDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "delete-user-auth", message: "ログインが必要です" });
      return;
    }

    setIsSubmitting(true);

    try {
      // DELETEエンドポイントが存在する場合の実装
      // エンドポイントが存在しない場合は、エラーハンドリングで対応
      const response = await apiClient.DELETE("/group/{groupId}/user/{userId}", {
        params: {
          path: {
            groupId,
            userId,
          },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.error) {
        const errorMessage =
          response.error.message || "メンバーの削除に失敗しました";
        setNewError({ name: "delete-user-error", message: errorMessage });
        setIsSubmitting(false);
        return;
      }

      handleClose();
      onSuccess();
    } catch (error) {
      console.error("Error deleting user from group:", error);
      // DELETEエンドポイントが存在しない場合のフォールバック
      // バックエンドで実装されるまでの暫定対応
      if (error instanceof Error && error.message.includes("DELETE")) {
        setNewError({
          name: "delete-user-error",
          message: "メンバー削除機能は現在利用できません。バックエンドの実装を確認してください。",
        });
      } else {
        setNewError({
          name: "delete-user-error",
          message: "メンバーの削除に失敗しました",
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>メンバー削除の確認</DialogTitle>
      <IconButton
        aria-label="削除操作をキャンセルする"
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
      <DialogContent dividers sx={{ maxWidth: "400px" }}>
        <Stack spacing={2}>
          <Typography>本当に「{userName}」をグループから削除しますか？</Typography>
          <Typography variant="body2" color="text.secondary">
            削除後は元に戻すことができません！
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              削除する
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;

