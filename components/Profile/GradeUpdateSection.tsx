import { useRouter } from "next/router";
import { useMemo, useState, useTransition } from "react";

import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import Heading from "@/components/Common/Heading";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { getRequestStatusChipProps } from "@/utils/chip/requestStatus";
import { apiClient } from "@/utils/fetch/client";

import type { components } from "@/utils/fetch/api";

type GradeUpdateRequest = components["schemas"]["ResGetUserMeGradeUpdateObjectGradeUpdate"];

type GradeUpdateSectionProps = {
  gradeUpdates: GradeUpdateRequest[];
};

const GradeUpdateSection = ({ gradeUpdates }: GradeUpdateSectionProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const pendingExists = useMemo(
    () => gradeUpdates.some((gradeUpdate) => gradeUpdate.status === "pending"),
    [gradeUpdates],
  );

  const approvedCount = useMemo(
    () => gradeUpdates.filter((gradeUpdate) => gradeUpdate.status === "approved").length,
    [gradeUpdates],
  );

  const canSubmit =
    !!authState.token && reason.trim().length > 0 && !pendingExists && approvedCount < 2;

  const handleSubmit = () => {
    if (!authState.token || !canSubmit) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await apiClient.POST("/user/me/grade-update", {
          body: {
            reason: reason.trim(),
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (response.error) {
          setNewError({
            message: response.error.message || "学年補正申請の送信に失敗しました",
            name: "grade-update-submit-fail",
          });
          return;
        }

        removeError("grade-update-submit-fail");
        setReason("");
        await router.replace(router.asPath);
      } catch {
        setNewError({
          message: "学年補正申請の送信に失敗しました",
          name: "grade-update-submit-fail",
        });
      }
    });
  };

  return (
    <Stack spacing={2}>
      <Heading level={3}>学年補正申請</Heading>
      <Typography>
        留年や休学などで現在の学年表示にズレがある場合は、理由を記載して申請してください。
        1回の承認で1学年分の補正が行われ、承認は最大2回までです。
      </Typography>

      {pendingExists && (
        <Typography color="warning.main">
          審査中の申請があります。承認または却下されるまで新しい申請はできません。
        </Typography>
      )}

      {approvedCount >= 2 && (
        <Typography color="warning.main">
          承認済みの学年補正申請が2回に達しているため、新しい申請はできません。
        </Typography>
      )}

      <TextField
        label="申請理由"
        multiline
        minRows={3}
        placeholder="例: 休学していた期間があるため、表示学年を1学年分補正したいです"
        value={reason}
        onChange={(event) => {
          setReason(event.target.value);
        }}
      />

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
        >
          申請する
        </Button>
      </Stack>

      <Heading level={4}>申請履歴</Heading>
      {gradeUpdates.length === 0 ? (
        <Typography color="text.secondary">学年補正申請の履歴はありません。</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>申請日時</TableCell>
                <TableCell>補正値</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>理由</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradeUpdates.map((gradeUpdate) => (
                <TableRow key={gradeUpdate.gradeUpdateId}>
                  <TableCell>
                    {dayjs(gradeUpdate.createdAt).format("YYYY/MM/DD HH:mm:ss")}
                  </TableCell>
                  <TableCell>{gradeUpdate.gradeDiff * -1}学年分</TableCell>
                  <TableCell>
                    <Chip {...getRequestStatusChipProps(gradeUpdate.status)} size="small" />
                  </TableCell>
                  <TableCell>{gradeUpdate.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default GradeUpdateSection;
