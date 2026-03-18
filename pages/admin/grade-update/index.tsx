import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { ArrowBack } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import { ButtonLink } from "@/components/Common/ButtonLink";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { getRequestStatusChipProps } from "@/utils/chip/requestStatus";
import { apiClient, createServerApiClient } from "@/utils/fetch/client";

import type { components } from "@/utils/fetch/api";

type GradeUpdateRequest = components["schemas"]["ResGetAdminGradeUpdateObjectGradeUpdate"];

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const response = await client.GET("/admin/grade-update");

    if (!response.data || !response.data.gradeUpdates) {
      return { props: { gradeUpdates: [] } };
    }

    return { props: { gradeUpdates: response.data.gradeUpdates } };
  } catch (error) {
    console.error("Failed to fetch grade update requests:", error);
    return { props: { gradeUpdates: [] } };
  }
};

const AdminGradeUpdatePage = ({
  gradeUpdates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (gradeUpdateId: string, status: "approved" | "rejected") => {
    if (!authState.token || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.PUT("/admin/grade-update/{gradeUpdateId}", {
        body: {
          status,
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          path: {
            gradeUpdateId,
          },
        },
      });

      if (response.error) {
        setNewError({
          message: response.error.message || "学年補正申請の更新に失敗しました",
          name: "admin-grade-update-fail",
        });
        return;
      }

      removeError("admin-grade-update-fail");
      await router.replace(router.asPath);
    } catch {
      setNewError({
        message: "学年補正申請の更新に失敗しました",
        name: "admin-grade-update-fail",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHead title="[管理者用] 学年補正申請一覧" />

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin" startIcon={<ArrowBack />} variant="text">
            管理者用ポータルに戻る
          </ButtonLink>
        </Stack>

        {gradeUpdates.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>申請日時</TableCell>
                  <TableCell>申請者</TableCell>
                  <TableCell>補正値</TableCell>
                  <TableCell>理由</TableCell>
                  <TableCell>状態</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gradeUpdates.map((request: GradeUpdateRequest) => (
                  <TableRow key={request.gradeUpdateId}>
                    <TableCell>{dayjs(request.createdAt).format("YYYY/MM/DD HH:mm:ss")}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{request.gradeDiff * -1}学年分</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Chip {...getRequestStatusChipProps(request.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disabled={isLoading}
                          onClick={() => {
                            updateStatus(request.gradeUpdateId, "approved");
                          }}
                          startIcon={
                            isLoading ? <CircularProgress size={14} color="inherit" /> : undefined
                          }
                        >
                          承認
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={isLoading}
                          onClick={() => {
                            updateStatus(request.gradeUpdateId, "rejected");
                          }}
                        >
                          却下
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography my={2}>承認待ちの学年補正申請はありません</Typography>
        )}
      </Stack>
    </>
  );
};

export default AdminGradeUpdatePage;
