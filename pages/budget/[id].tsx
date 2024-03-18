import { useBudget } from "../../hook/budget/useBudget";
import { useAuthState } from "../../hook/useAuthState";
import {
  Budget,
  BudgetStatus,
  PutBudgetAdminRequest,
  PutBudgetRequest,
} from "../../interfaces/budget";
import {
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import PageHead from "../../components/Common/PageHead";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import BudgetEditor from "../../components/Budget/BudgetEditor";
import { WorkFileView } from "../../components/Work/WorkFileView";
import { BudgetFileView } from "../../components/Budget/BudgetFileView";
import { useState } from "react";
import { AdminApproveDialog } from "../../components/Budget/AdminApproveDialog";
import { AdminRejectDialog } from "../../components/Budget/AdminRejectDialog";

const budgetStatusColor: {
  [K in BudgetStatus]:
    | "primary"
    | "error"
    | "success"
    | "warning"
    | "default"
    | "secondary"
    | "info";
} = {
  pending: "default",
  reject: "error",
  approve: "success",
  bought: "secondary",
  paid: "primary",
};

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

type Props = {
  id: string;
  modeStr?: string;
  error?: string;
  budgetPublic?: Budget;
};

const BudgetDetailPage = ({ id, modeStr, error }: Props) => {
  const router = useRouter();
  const {
    budgetDetail,
    updateBudgetStatusApprove,
    updateBudgetStatusBought,
    updateBudgetStatusPaid,
    updateBudgetStatusPending,
    updateAdminBudget,
  } = useBudget(id);
  const { authState } = useAuthState();
  const [openAdminApproveDialog, setOpenAdminApproveDialog] = useState(false);
  const [openAdminRejectDialog, setOpenAdminRejectDialog] = useState(false);

  const onSubmit = (budgetRequest: PutBudgetRequest) => {
    switch (budgetDetail.status) {
      case "pending":
        updateBudgetStatusPending(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
      case "approve":
        updateBudgetStatusApprove(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
      case "bought":
        updateBudgetStatusBought(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
      case "paid":
        updateBudgetStatusPaid(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
    }
  };

  const submitAdminApprove = () => {
    updateAdminBudget({
      status: "approve",
    }).then((result) => {
      if (!result) return;
      setOpenAdminApproveDialog(false);
    });
  };

  const submitAdminReject = () => {
    updateAdminBudget({
      status: "reject",
    }).then((result) => {
      if (!result) return;
      setOpenAdminRejectDialog(false);
    });
  };

  if (!authState.isLogined) return <></>;
  if (!budgetDetail) return <p>Loading...</p>;

  return (
    <Container>
      <PageHead title={modeStr === "admin" ? `★ ${budgetDetail.name}` : budgetDetail.name} />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          modeStr === "admin"
            ? { text: "Budget (ADMIN)", href: "/budget?mode=admin" }
            : { text: "Budget", href: "/budget" },
          { text: budgetDetail.name },
        ]}
      />
      {modeStr === "admin" ? (
        <>
          <AdminApproveDialog
            open={openAdminApproveDialog}
            onClose={() => setOpenAdminApproveDialog(false)}
            onConfirm={() => submitAdminApprove()}
            name={budgetDetail.name}
          />
          <AdminRejectDialog
            open={openAdminRejectDialog}
            onClose={() => setOpenAdminRejectDialog(false)}
            onConfirm={() => submitAdminReject()}
            name={budgetDetail.name}
          />
        </>
      ) : (
        <></>
      )}

      {modeStr === "edit" ? (
        <>
          <Grid>
            <h1>{budgetDetail.name}</h1>
            <Chip label={budgetDetail.status} color={budgetStatusColor[budgetDetail.status]} />
          </Grid>
          <BudgetEditor onSubmit={onSubmit} initBudget={budgetDetail} />
        </>
      ) : (
        <>
          <Grid>
            <h1>{budgetDetail.name}</h1>
            <div>
              <Chip label={budgetDetail.status} color={budgetStatusColor[budgetDetail.status]} />
              {modeStr === "admin" ? (
                <>
                  {budgetDetail.status === "pending" ? (
                    <>
                      <Stack spacing={3} direction="row" sx={{ marginTop: 3 }}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => {
                            setOpenAdminApproveDialog(true);
                          }}
                        >
                          承認
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            setOpenAdminRejectDialog(true);
                          }}
                        >
                          却下
                        </Button>
                      </Stack>
                    </>
                  ) : budgetDetail.status === "bought" ? (
                    <></>
                  ) : (
                    <></>
                  )}
                </>
              ) : authState.user.userId === budgetDetail.proposer.userId ? (
                // 通常モード かつ 編集権限がある場合
                <div style={{ float: "right" }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.push(`/budget/${budgetDetail.budgetId}?mode=edit`);
                    }}
                  >
                    編集
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </Grid>
          <Grid container sx={{ marginTop: 3 }}>
            <TableContainer>
              <hr />
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableBody>
                  <TableRow>
                    <TableCell>種別</TableCell>
                    <TableCell>{budgetDetail.class}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>利用目的</TableCell>
                    <TableCell>{budgetDetail.purpose}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>予定金額</TableCell>
                    <TableCell>{budgetDetail.budget} 円</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>購入金額</TableCell>
                    <TableCell>{budgetDetail.settlement} 円</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>備考</TableCell>
                    <TableCell>{budgetDetail.remark}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>申請者</TableCell>
                    <TableCell>{budgetDetail.proposer.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>申請日時</TableCell>
                    <TableCell>
                      {new Date(budgetDetail.createdAt).toLocaleString("ja-JP", dateOptions)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>更新日時</TableCell>
                    <TableCell>
                      {new Date(budgetDetail.updatedAt).toLocaleString("ja-JP", dateOptions)}
                    </TableCell>
                  </TableRow>
                  {budgetDetail.status === "approve" ||
                  budgetDetail.status === "bought" ||
                  budgetDetail.status === "paid" ? (
                    <>
                      <TableRow>
                        <TableCell>承認者</TableCell>
                        <TableCell>
                          {budgetDetail.approver.username ||
                            `(${budgetDetail.class}のため自動承認)`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>承認日時</TableCell>
                        <TableCell>
                          {new Date(
                            budgetDetail.approvedAt || budgetDetail.createdAt,
                          ).toLocaleString("ja-JP", dateOptions)}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <></>
                  )}
                  <TableRow>
                    <TableCell>領収書</TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {budgetDetail.files ? (
                          budgetDetail.files.map((f) => <BudgetFileView fileId={f.fileId} />)
                        ) : (
                          <></>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BudgetDetailPage;

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const id = params?.id;
    const { mode } = query;
    const modeStr = typeof mode === "string" ? mode : null;
    return { props: { id, modeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
