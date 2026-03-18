import { useState } from "react";

import { ArrowBack, Autorenew, PersonOff, School } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { apiClient } from "@/utils/fetch/client";

type InfraAction = "inactive" | "school-grade";

type ActionResult = {
  message: string;
  severity: "success" | "info";
} | null;

const ACTION_CONTENT: Record<
  InfraAction,
  {
    buttonLabel: string;
    description: string;
    dialogDescription: string;
    title: string;
  }
> = {
  inactive: {
    buttonLabel: "inactive更新を実行",
    description: "非アクティブな部員を一括で非部員状態 (`is_member=false`) に更新します。",
    dialogDescription:
      "非アクティブ判定の対象ユーザーに対して、一括で `is_member=false` を反映します。実行後の取り消しはできません。",
    title: "inactive一括更新",
  },
  "school-grade": {
    buttonLabel: "学年更新を実行",
    description:
      "学籍番号ベースの計算と承認済み学年補正をもとに、対象ユーザーの `school_grade` を一括更新します。",
    dialogDescription:
      "対象ユーザーの `school_grade` を一括更新します。無効アカウントも一部含まれ、実行後の取り消しはできません。",
    title: "school_grade一括更新",
  },
};

const AdminInfraPage = () => {
  const { authState } = useAuthState();
  const { removeError, setNewError } = useErrorState();
  const [pendingAction, setPendingAction] = useState<InfraAction | null>(null);
  const [runningAction, setRunningAction] = useState<InfraAction | null>(null);
  const [result, setResult] = useState<ActionResult>(null);

  const handleCloseDialog = () => {
    if (runningAction !== null) return;
    setPendingAction(null);
  };

  const executeAction = async () => {
    if (!pendingAction || runningAction !== null) return;
    if (!authState.token) {
      setNewError({
        message: "ログイン情報が見つかりません。再度ログインしてください。",
        name: "admin-infra-auth-fail",
      });
      return;
    }

    setRunningAction(pendingAction);
    setResult(null);

    try {
      const response =
        pendingAction === "inactive"
          ? await apiClient.PUT("/admin/inactive", {
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            })
          : await apiClient.PUT("/admin/school-grade", {
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            });

      if (response.error) {
        setNewError({
          message:
            response.error.message || `${ACTION_CONTENT[pendingAction].title}の実行に失敗しました`,
          name: "admin-infra-run-fail",
        });
        return;
      }

      removeError("admin-infra-auth-fail");
      removeError("admin-infra-run-fail");
      setResult({
        message: `${ACTION_CONTENT[pendingAction].title}を実行しました。`,
        severity: "success",
      });
      setPendingAction(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `${ACTION_CONTENT[pendingAction].title}の実行中にエラーが発生しました`;
      setNewError({
        message,
        name: "admin-infra-run-fail",
      });
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <>
      <PageHead title="[管理者用] インフラ管理" />

      <Stack spacing={3}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin" startIcon={<ArrowBack />} variant="text">
            管理者ポータルに戻る
          </ButtonLink>
        </Stack>

        <Box>
          <Heading level={2}>インフラ管理</Heading>
          <Typography color="text.secondary">
            運用向けの一括更新APIを実行します。どちらの操作も即時反映されるため、内容を確認してから実行してください。
          </Typography>
        </Box>

        {result && <Alert severity={result.severity}>{result.message}</Alert>}

        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PersonOff color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    {ACTION_CONTENT.inactive.title}
                  </Typography>
                </Stack>
                <Typography>{ACTION_CONTENT.inactive.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  バックエンドの `PUT /admin/inactive` を呼び出します。
                </Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ pb: 2, px: 2 }}>
              <Button
                variant="contained"
                color="warning"
                disabled={runningAction !== null}
                onClick={() => setPendingAction("inactive")}
                startIcon={
                  runningAction === "inactive" ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {ACTION_CONTENT.inactive.buttonLabel}
              </Button>
            </CardActions>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <School color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    {ACTION_CONTENT["school-grade"].title}
                  </Typography>
                </Stack>
                <Typography>{ACTION_CONTENT["school-grade"].description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  バックエンドの `PUT /admin/school-grade` を呼び出します。
                </Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ pb: 2, px: 2 }}>
              <Button
                variant="contained"
                disabled={runningAction !== null}
                onClick={() => setPendingAction("school-grade")}
                startIcon={
                  runningAction === "school-grade" ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {ACTION_CONTENT["school-grade"].buttonLabel}
              </Button>
            </CardActions>
          </Card>
        </Stack>
      </Stack>

      <Dialog open={pendingAction !== null} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {pendingAction ? `${ACTION_CONTENT[pendingAction].title}を実行しますか？` : ""}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <Typography>
              {pendingAction ? ACTION_CONTENT[pendingAction].dialogDescription : ""}
            </Typography>
            <Alert severity="warning">
              取り消しできない操作です。実行対象とタイミングを確認してから続行してください。
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={runningAction !== null}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              void executeAction();
            }}
            disabled={pendingAction === null || runningAction !== null}
            startIcon={
              runningAction !== null ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Autorenew />
              )
            }
          >
            実行する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminInfraPage;
