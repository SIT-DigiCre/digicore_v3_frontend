import type { GetServerSideProps } from "next";
import { useState, useTransition } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
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
  const [pendingMessage, setPendingMessage] = useState(
    isPendingReentryMessage(statusMessage) ? statusMessage : "",
  );

  const isPending = pendingMessage !== "";
  const hasSubmitted = reentryId !== null;
  const showSubmittedState = hasSubmitted || isPending;
  const shouldShowForm = !isPending;

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
        });
      } catch {
        setNewError({
          message: "再入部申請に失敗しました",
          name: "reentry-request-fail",
        });
      }
    });
  };

  if (showSubmittedState) {
    return (
      <>
        <PageHead title="再入部申請" />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: { sm: 4, xs: 2.5 } }}>
              <Stack spacing={2}>
                <Chip
                  icon={<HourglassTopIcon />}
                  label="承認待ち"
                  color="warning"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                />
                <Heading level={2}>再入部申請は承認待ちです</Heading>
                <Typography>
                  申請内容を管理者が確認中です。確認が完了するまで、再申請はできません。
                </Typography>
                {pendingMessage && <Alert severity="info">{pendingMessage}</Alert>}
                {reentryId && (
                  <Typography color="text.secondary" variant="body2">
                    申請ID: {reentryId}
                  </Typography>
                )}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: { sm: 4, xs: 2.5 } }}>
              <Stack spacing={2}>
                <Typography variant="h6">次の流れ</Typography>
                <Divider />
                <Typography>1. 管理者が振込状況と申請内容を確認します。</Typography>
                <Typography>2. 承認されると通常どおりログインできます。</Typography>
                <Typography color="text.secondary" variant="body2">
                  対応に時間がかかる場合があります。しばらく待ってから再度ログインをお試しください。
                </Typography>
              </Stack>
            </Paper>

            <Box>
              <ButtonLink href="/login" variant="outlined">
                ログインページに戻る
              </ButtonLink>
            </Box>
          </Stack>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHead title="再入部申請" />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: { sm: 4, xs: 2.5 } }}>
            <Stack spacing={2}>
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label="申請受付中"
                color="info"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              <Heading level={2}>再入部申請</Heading>
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
            </Stack>
          </Paper>

          {shouldShowForm && (
            <Paper variant="outlined" sx={{ p: { sm: 4, xs: 2.5 } }}>
              <Stack spacing={2}>
                <Typography variant="h6">申請フォーム</Typography>
                <Divider />
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
          )}

          <Paper variant="outlined" sx={{ p: { sm: 4, xs: 2.5 } }}>
            <Stack spacing={2}>
              <Typography variant="h6">部費振込先</Typography>
              <Divider />
              <TransferClubFeeView />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default ReentryPage;
