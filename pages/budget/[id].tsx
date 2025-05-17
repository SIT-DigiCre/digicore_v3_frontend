import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { ErrorOutline, WarningAmber } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { AdminApproveDialog } from "../../components/Budget/AdminApproveDialog";
import { AdminPaidDialog } from "../../components/Budget/AdminPaidDialog";
import { AdminRejectDialog } from "../../components/Budget/AdminRejectDialog";
import BudgetEditor from "../../components/Budget/BudgetEditor";
import { BudgetFileView } from "../../components/Budget/BudgetFileView";
import { DeleteBudgetDialog } from "../../components/Budget/DeleteBudgetDialog";
import { MarkAsBoughtDialog } from "../../components/Budget/MarkAsBoughtDialog";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { useBudget } from "../../hook/budget/useBudget";
import { useAuthState } from "../../hook/useAuthState";
import { Budget, BudgetClass, BudgetStatus, PutBudgetRequest } from "../../interfaces/budget";

const classDisplay: {
  [K in BudgetClass]: string;
} = {
  room: "部室",
  project: "企画",
  outside: "学外活動",
  fixed: "固定費用",
  festival: "学園祭",
};

const statusDisplay: {
  [K in BudgetStatus]: string;
} = {
  pending: "申請中",
  reject: "却下",
  approve: "承認済み",
  bought: "購入済み",
  paid: "支払い完了",
};

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
    deleteBudgetStatusPending,
    deleteBudgetStatusApprove,
  } = useBudget(id);
  const { authState } = useAuthState();
  const [openAdminApproveDialog, setOpenAdminApproveDialog] = useState(false);
  const [openAdminRejectDialog, setOpenAdminRejectDialog] = useState(false);
  const [openAdminPaidDialog, setOpenAdminPaidDialog] = useState(false);
  const [openMarkAsBoughtDialog, setOpenMarkAsBoughtDialog] = useState(false);
  const [openDeleteBudgetDialog, setOpenDeleteBudgetDialog] = useState(false);

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

  const submitAdminPaid = () => {
    updateAdminBudget({
      status: "paid",
    }).then((result) => {
      if (!result) return;
      setOpenAdminPaidDialog(false);
    });
  };

  const submitMarkAsBought = () => {
    updateBudgetStatusApprove({
      bought: true,
      files: budgetDetail.files ? budgetDetail.files.map((f) => f.fileId) : [],
      remark: budgetDetail.remark,
      settlement: budgetDetail.settlement,
    }).then((result) => {
      if (!result) return;
      setOpenMarkAsBoughtDialog(false);
    });
  };

  const submitDelete = () => {
    switch (budgetDetail.status) {
      case "pending":
        deleteBudgetStatusPending().then((result) => {
          if (!result) return;
          router.push(`/budget`);
        });
        break;
      case "approve":
        deleteBudgetStatusApprove().then((result) => {
          if (!result) return;
          router.push(`/budget`);
        });
        break;
    }
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
          <AdminPaidDialog
            open={openAdminPaidDialog}
            onClose={() => setOpenAdminPaidDialog(false)}
            onConfirm={() => submitAdminPaid()}
            name={budgetDetail.name}
            filesMissing={budgetDetail.files.length === 0}
          />
        </>
      ) : (
        <></>
      )}
      <MarkAsBoughtDialog
        open={openMarkAsBoughtDialog}
        onClose={() => setOpenMarkAsBoughtDialog(false)}
        onConfirm={() => submitMarkAsBought()}
        name={budgetDetail.name}
      />
      <DeleteBudgetDialog
        open={openDeleteBudgetDialog}
        onClose={() => setOpenDeleteBudgetDialog(false)}
        onConfirm={() => submitDelete()}
        name={budgetDetail.name}
      />

      {modeStr === "edit" ? (
        <>
          <Grid>
            <h1>{budgetDetail.name}</h1>
            <Chip
              label={statusDisplay[budgetDetail.status]}
              color={budgetStatusColor[budgetDetail.status]}
            />
          </Grid>
          <BudgetEditor onSubmit={onSubmit} initBudget={budgetDetail} />
        </>
      ) : (
        <>
          <Grid>
            <h1>{budgetDetail.name}</h1>
            <div>
              <Chip
                label={statusDisplay[budgetDetail.status]}
                color={budgetStatusColor[budgetDetail.status]}
              />
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
                    <>
                      <Stack direction="row" sx={{ marginTop: 3, gap: 2 }} flexWrap="wrap">
                        <Button
                          variant="contained"
                          onClick={() => {
                            setOpenAdminPaidDialog(true);
                          }}
                        >
                          支払い完了にする
                        </Button>
                        {budgetDetail.files.length === 0 && (
                          <Stack spacing={0.5} direction="row" alignItems="center" color="#d32f2f">
                            <ErrorOutline color="error" fontSize="small" />
                            <p>この稟議には領収書が添付されていません</p>
                          </Stack>
                        )}
                      </Stack>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : authState.user.userId === budgetDetail.proposer.userId ? (
                // 通常モード かつ 編集権限がある場合
                <>
                  <div style={{ float: "right" }}>
                    <Stack spacing={3} direction="row">
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push(`/budget/${budgetDetail.budgetId}?mode=edit`);
                        }}
                      >
                        編集
                      </Button>
                      {(budgetDetail.status === "pending" || budgetDetail.status === "approve") && (
                        <>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              setOpenDeleteBudgetDialog(true);
                            }}
                          >
                            削除
                          </Button>
                        </>
                      )}
                    </Stack>
                  </div>
                </>
              ) : (
                <></>
              )}
              {budgetDetail.status === "approve" &&
              authState.user.userId === budgetDetail.proposer.userId ? (
                <Stack direction="row" sx={{ marginTop: 3, gap: 2 }} flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenMarkAsBoughtDialog(true);
                    }}
                    disabled={budgetDetail.files.length === 0}
                  >
                    購入済みにする
                  </Button>
                  {budgetDetail.files.length === 0 && (
                    <Stack spacing={0.5} direction="row" alignItems="center" color="#ed6c02">
                      <WarningAmber fontSize="inherit" color="warning" />
                      <p>購入済みにするには「編集」から領収書の添付が必要です</p>
                    </Stack>
                  )}
                </Stack>
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
                    <TableCell>{classDisplay[budgetDetail.class]}</TableCell>
                  </TableRow>
                  {budgetDetail.class === "outside" ||
                  budgetDetail.class === "project" ||
                  budgetDetail.class === "room" ? (
                    <>
                      <TableRow>
                        <TableCell>利用目的</TableCell>
                        <TableCell>{budgetDetail.purpose}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>予定金額</TableCell>
                        <TableCell>{budgetDetail.budget} 円</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <></>
                  )}
                  {budgetDetail.status === "approve" ||
                  budgetDetail.status === "bought" ||
                  budgetDetail.status === "paid" ? (
                    <TableRow>
                      <TableCell>購入金額</TableCell>
                      <TableCell>{budgetDetail.settlement} 円</TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}
                  <TableRow>
                    <TableCell>備考</TableCell>
                    <TableCell>{budgetDetail.remark}</TableCell>
                  </TableRow>
                  {budgetDetail.class === "outside" ||
                  budgetDetail.class === "project" ||
                  budgetDetail.class === "room" ? (
                    <TableRow>
                      <TableCell>スレッド</TableCell>
                      <TableCell>
                        {budgetDetail.mattermostUrl &&
                        new URL(budgetDetail.mattermostUrl).hostname === "mm.digicre.net" ? (
                          <IconButton
                            size="small"
                            title="Mattermostで開く"
                            onClick={() =>
                              router.push(
                                budgetDetail.mattermostUrl.replace(/^http[s]?:/, "mattermost:"),
                              )
                            }
                          >
                            <LaunchIcon />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}

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
                            `(${classDisplay[budgetDetail.class]}のため自動承認)`}
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
                  {budgetDetail.status === "approve" ||
                  budgetDetail.status === "bought" ||
                  budgetDetail.status === "paid" ? (
                    <TableRow>
                      <TableCell>領収書</TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          {budgetDetail.files ? (
                            budgetDetail.files.map((f) => (
                              <BudgetFileView fileId={f.fileId} key={f.fileId} />
                            ))
                          ) : (
                            <></>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}
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
