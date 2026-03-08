import type { GetServerSideProps } from "next";
import { useState, useTransition } from "react";

import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { apiClient } from "@/utils/fetch/client";

type ReentryPageProps = {
  statusMessage?: string;
};

export const getServerSideProps: GetServerSideProps<ReentryPageProps> = async ({ query }) => {
  const statusMessage = typeof query.message === "string" ? query.message : "";
  return { props: { statusMessage } };
};

const getJwtFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const jwtCookie = document.cookie.split("; ").find((row) => row.startsWith("jwt="));
  return jwtCookie ? jwtCookie.replace(/^jwt=/, "") : null;
};

const ReentryPage = ({ statusMessage }: ReentryPageProps) => {
  const { removeError, setNewError } = useErrorState();
  const [transferName, setTransferName] = useState("");
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [reentryId, setReentryId] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState(
    statusMessage?.includes("確認中") ? statusMessage : "",
  );

  const showPaymentGuide = reentryId !== null || pendingMessage !== "";

  const handleSubmit = async () => {
    if (!transferName.trim()) {
      setNewError({
        message: "振込名義を入力してください",
        name: "reentry-request-fail",
      });
      return;
    }

    const jwt = getJwtFromCookie();
    if (!jwt) {
      setNewError({
        message: "ログイン状態を確認できません。再度ログインしてください。",
        name: "reentry-request-fail",
      });
      return;
    }

    startSubmittingTransition(async () => {
      const response = await apiClient.PUT("/user/me/reentry", {
        body: {
          transferName: transferName.trim(),
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.error) {
        const message = response.error.message || "再入部申請に失敗しました";
        if (
          message.includes("未処理の再入部申請があります") ||
          message.includes("再入部申請の確認中です")
        ) {
          removeError("reentry-request-fail");
          setPendingMessage(message);
          return;
        }

        setNewError({
          message,
          name: "reentry-request-fail",
        });
        return;
      }

      removeError("reentry-request-fail");
      setPendingMessage("");
      setReentryId(response.data?.reentryId ?? "");
    });
  };

  if (showPaymentGuide) {
    return (
      <>
        <PageHead title="再入部申請" />
        <Stack spacing={3}>
          <Heading level={2}>再入部申請を受け付けました</Heading>
          <Typography>
            申請内容を管理者が確認中です。部費振込の確認が完了すると、再入部が承認されます。
          </Typography>
          {pendingMessage && <Alert severity="info">{pendingMessage}</Alert>}
          {reentryId && (
            <Typography color="text.secondary" variant="body2">
              申請ID: {reentryId}
            </Typography>
          )}
          <ButtonLink href="/login" variant="outlined">
            ログインページに戻る
          </ButtonLink>
        </Stack>
      </>
    );
  }

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
        </Alert>
        <Typography color="text.secondary" variant="body2">
          再入部申請はユーザーごとに最大2回までです。
        </Typography>
        {statusMessage && <Alert severity="warning">{statusMessage}</Alert>}

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
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Heading level={2}>部費振込先</Heading>
          <TransferClubFeeView />
        </Paper>
      </Stack>
    </>
  );
};

export default ReentryPage;
