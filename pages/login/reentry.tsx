import { useState, useTransition } from "react";

import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import TransferClubFeeView from "@/components/Register/TransferClubFeeView";
import { getTokenFromCookie } from "@/utils/auth/token";
import { apiClient } from "@/utils/fetch/client";

const ReentryPage = () => {
  const { removeError, setNewError } = useErrorState();
  const [transferName, setTransferName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [reentryId, setReentryId] = useState<string | null>(null);
  const [showSubmittedDialog, setShowSubmittedDialog] = useState(false);

  const handleSubmit = async () => {
    if (isPending) return;

    if (!transferName.trim()) {
      setNewError({
        message: "振込名義を入力してください",
        name: "reentry-request-fail",
      });
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      setNewError({
        message: "ログイン状態を確認できません。再度ログインしてください。",
        name: "reentry-request-fail",
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await apiClient.PUT("/user/me/reentry", {
          body: {
            transferName: transferName.trim(),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.error) {
          const message = response.error.message || "再入部申請に失敗しました";
          startTransition(() => {
            setNewError({
              message,
              name: "reentry-request-fail",
            });
          });
          return;
        }

        removeError("reentry-request-fail");
        startTransition(() => {
          setReentryId(response.data?.reentryId ?? "");
          setShowSubmittedDialog(true);
        });
      } catch {
        console.error("再入部申請に失敗しました");
        startTransition(() => {
          setNewError({
            message: "再入部申請に失敗しました",
            name: "reentry-request-fail",
          });
        });
      }
    });
  };

  return (
    <>
      <PageHead title="再入部申請" />
      <Stack spacing={3}>
        <Heading level={2}>アカウントが無効化されています</Heading>
        <Typography>
          再入部申請を行うと、振込報告とあわせて管理者に審査依頼が送信されます。
        </Typography>
        <Alert severity="info">
          このフォームは、部費未納で無効化された方と、休学中から復帰する方の再入部申請に対応しています。
          再入部申請はユーザーごとに最大2回までです。
        </Alert>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1">再入部申請フォーム</Typography>
            <TextField
              label="振込名義"
              helperText="ATM等で入力した振込名義（カタカナ）を入力してください"
              value={transferName}
              onChange={(e) => setTransferName(e.target.value)}
              required
              fullWidth
              disabled={isPending}
            />
            <Alert severity="warning">振込を終えたあとに申請してください。</Alert>
            <Box textAlign="end">
              <Button
                variant="contained"
                disabled={isPending || transferName.trim() === ""}
                onClick={handleSubmit}
                startIcon={isPending ? <CircularProgress size={18} /> : <SendIcon />}
              >
                再入部申請を送信する
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Heading level={2}>部費振込先</Heading>
          <TransferClubFeeView />
        </Paper>
      </Stack>

      <Dialog
        open={showSubmittedDialog}
        onClose={() => setShowSubmittedDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>再入部申請を受け付けました</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography>
              申請内容を管理者が確認中です。完了するまで再申請はしないでください。結果は後日メールにてお知らせします。
            </Typography>
            {reentryId && (
              <Typography color="text.secondary" variant="body2">
                申請ID: {reentryId}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmittedDialog(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReentryPage;
