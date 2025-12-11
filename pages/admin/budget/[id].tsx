import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { ArrowBack, ErrorOutline, WarningAmber } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";

import { AdminApproveDialog } from "../../../components/Budget/AdminApproveDialog";
import { AdminPaidDialog } from "../../../components/Budget/AdminPaidDialog";
import { AdminRejectDialog } from "../../../components/Budget/AdminRejectDialog";
import { BudgetFileView } from "../../../components/Budget/BudgetFileView";
import { ButtonLink } from "../../../components/Common/ButtonLink";
import Heading from "../../../components/Common/Heading";
import PageHead from "../../../components/Common/PageHead";
import { useAuthState } from "../../../hook/useAuthState";
import { budgetStatusColor, classDisplay, statusDisplay } from "../../../utils/budget/constants";
import { apiClient, createServerApiClient } from "../../../utils/fetch/client";

import type { paths } from "../../../utils/fetch/api.d";

type budgetResponse =
  paths["/budget/{budgetId}"]["get"]["responses"]["200"]["content"]["application/json"];

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps: GetServerSideProps<{
  budgetId: string;
  budget: budgetResponse;
}> = async ({ params, req }) => {
  const idParam = params?.id;
  const budgetId = typeof idParam === "string" ? idParam : "";
  if (!budgetId) return { notFound: true };

  const client = createServerApiClient(req);
  try {
    const budgetRes = await client.GET("/budget/{budgetId}", {
      params: {
        path: {
          budgetId,
        },
      },
    });
    if (!budgetRes.data) {
      return { notFound: true };
    }
    return {
      props: {
        budgetId,
        budget: budgetRes.data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch budget detail (admin):", error);
    return { notFound: true };
  }
};

const AdminbudgetPage = ({ budgetId, budget }: PageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();

  const [openAdminApproveDialog, setOpenAdminApproveDialog] = useState(false);
  const [openAdminRejectDialog, setOpenAdminRejectDialog] = useState(false);
  const [openAdminPaidDialog, setOpenAdminPaidDialog] = useState(false);

  const updateAdminBudget = (status: "approve" | "reject" | "paid") => {
    apiClient
      .PUT("/budget/{budgetId}/admin", {
        params: { path: { budgetId } },
        body: { status },
        headers: { Authorization: `Bearer ${authState.token}` },
      })
      .then(() => router.reload());
  };

  return (
    <>
      <PageHead title="[管理者用] 稟議詳細" />
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <ButtonLink href="/admin/budget" startIcon={<ArrowBack />} variant="text">
            稟議一覧に戻る
          </ButtonLink>
          <Chip label={statusDisplay[budget.status]} color={budgetStatusColor[budget.status]} />
        </Stack>

        <Heading level={2}>{budget.name}</Heading>

        {budget.status === "pending" ? (
          <Stack spacing={3} direction="row" mt={3} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setOpenAdminApproveDialog(true);
              }}
            >
              承認する
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpenAdminRejectDialog(true);
              }}
            >
              却下する
            </Button>
          </Stack>
        ) : (
          budget.status === "bought" && (
            <Stack direction="row" mt={3} gap={2} flexWrap="wrap" justifyContent="center">
              <Button
                variant="contained"
                onClick={() => {
                  setOpenAdminPaidDialog(true);
                }}
              >
                支払い完了にする
              </Button>
              {budget.files.length === 0 && (
                <Stack spacing={0.5} direction="row" alignItems="center" color="#d32f2f">
                  <ErrorOutline color="error" fontSize="small" />
                  <p>この稟議には領収書が添付されていません</p>
                </Stack>
              )}
            </Stack>
          )
        )}

        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  種別
                </TableCell>
                <TableCell>{classDisplay[budget.class]}</TableCell>
              </TableRow>
              {(budget.class === "outside" ||
                budget.class === "project" ||
                budget.class === "room") && (
                <>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      利用目的
                    </TableCell>
                    <TableCell>{budget.purpose}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      予定金額
                    </TableCell>
                    <TableCell>{budget.budget} 円</TableCell>
                  </TableRow>
                </>
              )}
              {(budget.status === "approve" ||
                budget.status === "bought" ||
                budget.status === "paid") && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    購入金額
                  </TableCell>
                  <TableCell>{budget.settlement} 円</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell component="th" scope="row">
                  備考
                </TableCell>
                <TableCell>{budget.remark}</TableCell>
              </TableRow>
              {(budget.class === "outside" ||
                budget.class === "project" ||
                budget.class === "room") && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    スレッド
                  </TableCell>
                  <TableCell>
                    {budget.mattermostUrl &&
                      new URL(budget.mattermostUrl).hostname === "mm.digicre.net" && (
                        <IconButton
                          size="small"
                          title="Mattermostで開く"
                          onClick={() =>
                            router.push(budget.mattermostUrl.replace(/^http[s]?:/, "mattermost:"))
                          }
                        >
                          <LaunchIcon />
                        </IconButton>
                      )}
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell component="th" scope="row">
                  申請者
                </TableCell>
                <TableCell>{budget.proposer.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  申請日時
                </TableCell>
                <TableCell>{dayjs(budget.createdAt).format("YYYY/MM/DD HH:mm:ss")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  更新日時
                </TableCell>
                <TableCell>{dayjs(budget.updatedAt).format("YYYY/MM/DD HH:mm:ss")}</TableCell>
              </TableRow>
              {(budget.status === "approve" ||
                budget.status === "bought" ||
                budget.status === "paid") && (
                <>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      承認者
                    </TableCell>
                    <TableCell>
                      {budget.approver.username || `(${classDisplay[budget.class]}のため自動承認)`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      承認日時
                    </TableCell>
                    <TableCell>
                      {dayjs(budget.approvedAt || budget.createdAt).format("YYYY/MM/DD HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      領収書
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1} maxWidth="min(500px, 50vw)">
                        {budget.files &&
                          budget.files.map((f) => (
                            <BudgetFileView fileId={f.fileId} key={f.fileId} />
                          ))}
                        {budget.files.length === 0 && (
                          <Stack spacing={0.5} direction="row" alignItems="center" color="#ed6c02">
                            <WarningAmber fontSize="inherit" color="warning" />
                            <p>領収書がありません</p>
                          </Stack>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <AdminApproveDialog
        open={openAdminApproveDialog}
        onClose={() => setOpenAdminApproveDialog(false)}
        onConfirm={() => {
          updateAdminBudget("approve");
          setOpenAdminApproveDialog(false);
        }}
        name={budget.name}
      />
      <AdminRejectDialog
        open={openAdminRejectDialog}
        onClose={() => setOpenAdminRejectDialog(false)}
        onConfirm={() => {
          updateAdminBudget("reject");
          setOpenAdminRejectDialog(false);
        }}
        name={budget.name}
      />
      <AdminPaidDialog
        open={openAdminPaidDialog}
        onClose={() => setOpenAdminPaidDialog(false)}
        onConfirm={() => {
          updateAdminBudget("paid");
          setOpenAdminPaidDialog(false);
        }}
        name={budget.name}
        filesMissing={budget.files.length === 0}
      />
    </>
  );
};

export default AdminbudgetPage;
