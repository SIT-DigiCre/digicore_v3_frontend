import type { GetServerSideProps } from "next";
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

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import TransferClubFeeView from "@/components/Register/TransferClubFeeView";
import { getTokenFromCookie } from "@/utils/auth/token";
import { apiClient } from "@/utils/fetch/client";

type ReentryPageProps = {
  statusMessage?: string;
};

const isPendingReentryMessage = (message?: string): boolean => {
  if (!message) return false;
  return (
    message.includes("未処理の再入部申請があります") ||
    message.includes("再入部申請の確認中です") ||
    message.includes("確認中")
  );
};

export const getServerSideProps: GetServerSideProps<ReentryPageProps> = async ({ query }) => {
  const statusMessage = typeof query.message === "string" ? query.message : "";
  return { props: { statusMessage } };
};

const ReentryPage = ({ statusMessage }: ReentryPageProps) => {
  const { removeError, setNewError } = useErrorState();
  const [transferName, setTransferName] = useState("");
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [reentryId, setReentryId] = useState<string | null>(null);
  const [showSubmittedDialog, setShowSubmittedDialog] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(
    isPendingReentryMessage(statusMessage) ? statusMessage : "",
  );

  const isPending = pendingMessage !== "";

  const handleSubmit = async () => {
    if (isSubmitting || isPending) return;

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

    startSubmittingTransition(async () => {
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
          if (
            message.includes("未処理の再入部申請があります") ||
            message.includes("再入部申請の確認中です")
          ) {
            removeError("reentry-request-fail");
            startSubmittingTransition(() => {
              setPendingMessage(message);
            });
            return;
          }

          setNewError({
            message,
            name: "reentry-request-fail",
          });
          return;
        }

        removeError("reentry-request-fail");
        startSubmittingTransition(() => {
          setPendingMessage("再入部申請を送信しました。現在、管理者の確認待ちです。");
          setReentryId(response.data?.reentryId ?? "");
          setShowSubmittedDialog(true);
        });
      } catch {
        setNewError({
          message: "再入部申請に失敗しました",
          name: "reentry-request-fail",
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
        {pendingMessage && <Alert severity="info">{pendingMessage}</Alert>}
        {isPending && (
          <Typography color="text.secondary" variant="body2">
            申請内容を管理者が確認中です。確認が完了するまで、再申請はできません。
          </Typography>
        )}

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1">再入部申請フォーム</Typography>
            {!isPending && (
              <>
                <TextField
                  label="振込名義"
                  helperText="ATM等で入力した振込名義（カタカナ）を入力してください"
                  value={transferName}
                  onChange={(e) => setTransferName(e.target.value)}
                  required
                  fullWidth
                  disabled={isSubmitting}
                />
                <Alert severity="warning">振込を終えたあとに申請してください。</Alert>
                <Box textAlign="end">
                  <Button
                    variant="contained"
                    disabled={isSubmitting || transferName.trim() === ""}
                    onClick={handleSubmit}
                    startIcon={isSubmitting ? <CircularProgress size={18} /> : <SendIcon />}
                  >
                    再入部申請を送信する
                  </Button>
                </Box>
              </>
            )}
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
              申請内容を管理者が確認中です。確認が完了するまで、再申請はできません。
            </Typography>
            <Alert severity="info">再入部申請を送信しました。現在、管理者の確認待ちです。</Alert>
            {reentryId && (
              <Typography color="text.secondary" variant="body2">
                申請ID: {reentryId}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmittedDialog(false)}>閉じる</Button>
          <ButtonLink href="/login" variant="contained">
            ログインページへ
          </ButtonLink>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReentryPage;
