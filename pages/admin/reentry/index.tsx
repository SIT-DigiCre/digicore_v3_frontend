import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useMemo, useState, useTransition } from "react";

import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

import { ButtonLink } from "@/components/Common/ButtonLink";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { apiClient, createServerApiClient } from "@/utils/fetch/client";

import type { components } from "@/utils/fetch/api.d.ts";

type AdminReentry = components["schemas"]["ResGetAdminReentryObjectReentry"];

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const reentriesRes = await client.GET("/admin/reentry");
    return { props: { reentries: reentriesRes.data?.reentries ?? ([] as AdminReentry[]) } };
  } catch (error) {
    console.error("Failed to fetch pending reentry requests:", error);
    return { props: { reentries: [] as AdminReentry[] } };
  }
};

const getPaymentStatusChip = (
  status: string,
): { color: "default" | "error" | "success" | "warning"; label: string } => {
  if (status === "checked") return { color: "success", label: "会計確認済み" };
  if (status === "pending") return { color: "warning", label: "会計確認待ち" };
  if (status === "unchecked") return { color: "error", label: "未確認" };
  return { color: "default", label: status };
};

const AdminReentryPage = ({
  reentries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { removeError, setNewError } = useErrorState();
  const [targetReentry, setTargetReentry] = useState<AdminReentry | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, startSubmittingTransition] = useTransition();

  const dialogOpen = targetReentry !== null;
  const paymentStatus = useMemo(() => {
    if (!targetReentry) return null;
    return getPaymentStatusChip(targetReentry.paymentStatus);
  }, [targetReentry]);

  const handleCloseDialog = () => {
    if (isSubmitting) return;
    setTargetReentry(null);
    setNote("");
  };

  const handleReview = async (status: "approved" | "rejected") => {
    if (!targetReentry) return;
    if (!authState.token) {
      setNewError({
        message: "ログイン情報が見つかりません。再度ログインしてください。",
        name: "reentry-review-fail",
      });
      return;
    }

    startSubmittingTransition(async () => {
      const response = await apiClient.PUT("/admin/reentry/{reentryId}", {
        body: {
          note: note.trim() === "" ? undefined : note.trim(),
          status,
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          path: {
            reentryId: targetReentry.reentryId,
          },
        },
      });

      if (response.error) {
        setNewError({
          message: response.error.message || "再入部申請の更新に失敗しました",
          name: "reentry-review-fail",
        });
        return;
      }

      removeError("reentry-review-fail");
      handleCloseDialog();
      await router.push(router.asPath);
    });
  };

  return (
    <>
      <PageHead title="[管理者用] 再入部申請一覧" />

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin" startIcon={<ArrowBack />} variant="text">
            管理者用ポータルに戻る
          </ButtonLink>
        </Stack>
        {reentries.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>申請日時</TableCell>
                  <TableCell>学籍番号</TableCell>
                  <TableCell>氏名</TableCell>
                  <TableCell>振込確認</TableCell>
                  <TableCell>備考</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reentries.map((reentry) => {
                  const chip = getPaymentStatusChip(reentry.paymentStatus);
                  return (
                    <TableRow key={reentry.reentryId}>
                      <TableCell>{new Date(reentry.createdAt).toLocaleString("ja-JP")}</TableCell>
                      <TableCell>{reentry.studentNumber}</TableCell>
                      <TableCell>{reentry.username}</TableCell>
                      <TableCell>
                        <Chip color={chip.color} label={chip.label} />
                      </TableCell>
                      <TableCell>{reentry.note ?? "-"}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setTargetReentry(reentry);
                            setNote(reentry.note ?? "");
                          }}
                        >
                          審査する
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography my={2}>承認待ちの再入部申請はありません</Typography>
        )}
      </Stack>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>再入部申請の審査</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <Typography variant="body2">学籍番号: {targetReentry?.studentNumber ?? "-"}</Typography>
            <Typography variant="body2">氏名: {targetReentry?.username ?? "-"}</Typography>
            <Typography variant="body2">
              振込確認:{" "}
              {paymentStatus ? (
                <Chip size="small" color={paymentStatus.color} label={paymentStatus.label} />
              ) : (
                "-"
              )}
            </Typography>
            <TextField
              label="備考"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              minRows={3}
              inputProps={{ maxLength: 255 }}
              disabled={isSubmitting}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button color="error" onClick={() => handleReview("rejected")} disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={18} /> : "却下する"}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleReview("approved")}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={18} /> : "承認する"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminReentryPage;
