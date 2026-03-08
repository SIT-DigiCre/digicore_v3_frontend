import { useRouter } from "next/router";
import { useState, useTransition } from "react";

import SchoolIcon from "@mui/icons-material/School";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import Heading from "@/components/Common/Heading";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { apiClient } from "@/utils/fetch/client";

const GraduationReportSection = () => {
  const router = useRouter();
  const { authState, refresh } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const schoolGrade = authState.user?.schoolGrade ?? 0;
  const isGraduated = authState.user?.isGraduated ?? false;
  const canReport = schoolGrade >= 4;
  const canSubmit =
    authState.isLogined && !!authState.token && !isGraduated && canReport;

  const handleGraduatedReport = () => {
    if (isGraduated) {
      setNewError({
        message: "すでに卒業報告済みです",
        name: "graduated-update-fail",
      });
      return;
    }

    if (!canReport) {
      setNewError({
        message: "卒業報告は4年生以上から利用できます",
        name: "graduated-update-fail",
      });
      return;
    }

    if (!authState.token) {
      setNewError({ message: "ログインが必要です", name: "graduated-update-fail" });
      return;
    }

    startTransition(async () => {
      try {
        const response = await apiClient.PUT("/user/me/graduated", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (response.error) {
          setNewError({
            message: response.error.message || "卒業報告の送信に失敗しました",
            name: "graduated-update-fail",
          });
          return;
        }

        removeError("graduated-update-fail");
        setOpenConfirmDialog(false);

        await refresh();
        await router.replace(router.asPath);
      } catch {
        setNewError({
          message: "卒業報告の送信に失敗しました",
          name: "graduated-update-fail",
        });
      }
    });
  };

  return (
    <Stack spacing={2}>
      <Heading level={3}>卒業報告</Heading>
      <Typography>
        卒業が確定した場合は、以下のボタンから卒業報告を行ってください。送信後は在籍情報が更新されます。
      </Typography>
      {!canReport && (
        <Typography color="text.secondary">
          卒業報告は4年生以上になると送信できます。現在は送信対象外です。
        </Typography>
      )}
      {isGraduated && (
        <Typography color="text.secondary">このアカウントは卒業報告済みです。</Typography>
      )}
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="warning"
          startIcon={<SchoolIcon />}
          disabled={!canSubmit || isPending}
          onClick={() => setOpenConfirmDialog(true)}
        >
          卒業を報告する
        </Button>
      </Stack>

      <Dialog
        open={openConfirmDialog}
        onClose={() => {
          if (!isPending) {
            setOpenConfirmDialog(false);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>卒業報告の確認</DialogTitle>
        <DialogContent dividers>
          <Typography>
            卒業報告を送信します。取り消しは管理者対応が必要になるため、内容に問題がないことを確認してから実行してください。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenConfirmDialog(false);
            }}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleGraduatedReport}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          >
            送信する
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default GraduationReportSection;
