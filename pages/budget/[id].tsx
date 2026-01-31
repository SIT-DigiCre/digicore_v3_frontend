import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { ArrowBack, Check, Delete, Edit, ErrorOutline, WarningAmber } from "@mui/icons-material";
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

import { AdminApproveDialog } from "../../components/Budget/AdminApproveDialog";
import { AdminPaidDialog } from "../../components/Budget/AdminPaidDialog";
import { AdminRejectDialog } from "../../components/Budget/AdminRejectDialog";
import BudgetEditor from "../../components/Budget/BudgetEditor";
import { BudgetFileView } from "../../components/Budget/BudgetFileView";
import { DeleteBudgetDialog } from "../../components/Budget/DeleteBudgetDialog";
import { MarkAsBoughtDialog } from "../../components/Budget/MarkAsBoughtDialog";
import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import { useBudgetActions } from "../../hook/budget/useBudget";
import { useAuthState } from "../../hook/useAuthState";
import { BudgetDetail, PutBudgetRequest } from "../../interfaces/budget";
import { budgetStatusColor, classDisplay, statusDisplay } from "../../utils/budget/constants";
import { createServerApiClient } from "../../utils/fetch/client";

import type { paths } from "../../utils/fetch/api.d";

type BudgetDetailResponse =
  paths["/budget/{budgetId}"]["get"]["responses"]["200"]["content"]["application/json"];

type BudgetDetailPageProps = {
  id: string;
  modeStr?: string;
  budget: BudgetDetail;
};

const BudgetDetailPage = ({ id, modeStr, budget: budgetDetail }: BudgetDetailPageProps) => {
  const router = useRouter();
  const {
    updateBudgetStatusApprove,
    updateBudgetStatusBought,
    updateBudgetStatusPaid,
    updateBudgetStatusPending,
    updateAdminBudget,
    deleteBudgetStatusPending,
    deleteBudgetStatusApprove,
  } = useBudgetActions(id);
  const { authState } = useAuthState();
  const [openAdminApproveDialog, setOpenAdminApproveDialog] = useState(false);
  const [openAdminRejectDialog, setOpenAdminRejectDialog] = useState(false);
  const [openAdminPaidDialog, setOpenAdminPaidDialog] = useState(false);
  const [openMarkAsBoughtDialog, setOpenMarkAsBoughtDialog] = useState(false);
  const [openDeleteBudgetDialog, setOpenDeleteBudgetDialog] = useState(false);

  if (!authState.user) return <p>読み込み中...</p>;

  const onSubmit = (budgetRequest: PutBudgetRequest) => {
    switch (budgetDetail.status) {
      case "pending":
        updateBudgetStatusPending(budgetRequest).then((result) => {
          if (!result) return;
          router.replace(router.asPath);
        });
        break;
      case "approve":
        updateBudgetStatusApprove(budgetRequest).then((result) => {
          if (!result) return;
          router.replace(router.asPath);
        });
        break;
      case "bought":
        updateBudgetStatusBought(budgetRequest).then((result) => {
          if (!result) return;
          router.replace(router.asPath);
        });
        break;
      case "paid":
        updateBudgetStatusPaid(budgetRequest).then((result) => {
          if (!result) return;
          router.replace(router.asPath);
        });
        break;
    }
  };

  const submitAdminApprove = () => {
    updateAdminBudget({ status: "approve" }).then((result) => {
      if (!result) return;
      setOpenAdminApproveDialog(false);
      router.replace(router.asPath);
    });
  };

  const submitAdminReject = () => {
    updateAdminBudget({ status: "reject" }).then((result) => {
      if (!result) return;
      setOpenAdminRejectDialog(false);
      router.replace(router.asPath);
    });
  };

  const submitAdminPaid = () => {
    updateAdminBudget({ status: "paid" }).then((result) => {
      if (!result) return;
      setOpenAdminPaidDialog(false);
      router.replace(router.asPath);
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
      router.replace(router.asPath);
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

  return (
    <>
      <PageHead title={modeStr === "admin" ? `★ ${budgetDetail.name}` : budgetDetail.name} />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink
          href={modeStr === "admin" ? "/budget?mode=admin" : "/budget"}
          startIcon={<ArrowBack />}
          variant="text"
        >
          稟議一覧に戻る
        </ButtonLink>
        <Chip
          label={statusDisplay[budgetDetail.status as keyof typeof statusDisplay]}
          color={budgetStatusColor[budgetDetail.status as keyof typeof budgetStatusColor]}
        />
      </Stack>
      {modeStr === "admin" && (
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
        <BudgetEditor onSubmit={onSubmit} initBudget={budgetDetail as BudgetDetailResponse} />
      ) : (
        <Stack direction="column" spacing={2} my={2}>
          <div>
            {modeStr === "admin" ? (
              <>
                {budgetDetail.status === "pending" ? (
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
                  budgetDetail.status === "bought" && (
                    <Stack direction="row" mt={3} gap={2} flexWrap="wrap" justifyContent="center">
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
                  )
                )}
              </>
            ) : (
              authState.user.userId === budgetDetail.proposer.userId && (
                // 通常モード かつ 編集権限がある場合
                <Stack spacing={3} direction="row" justifyContent="flex-end">
                  <ButtonLink
                    href={`/budget/${budgetDetail.budgetId}?mode=edit`}
                    variant="contained"
                    startIcon={<Edit />}
                  >
                    編集する
                  </ButtonLink>
                  {(budgetDetail.status === "pending" || budgetDetail.status === "approve") && (
                    <>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          setOpenDeleteBudgetDialog(true);
                        }}
                      >
                        削除する
                      </Button>
                    </>
                  )}
                </Stack>
              )
            )}
            {budgetDetail.status === "approve" &&
              authState.user.userId === budgetDetail.proposer.userId && (
                <Stack direction="row" sx={{ marginTop: 3, gap: 2 }} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<Check />}
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
              )}
          </div>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    種別
                  </TableCell>
                  <TableCell>
                    {classDisplay[budgetDetail.class as keyof typeof classDisplay]}
                  </TableCell>
                </TableRow>
                {budgetDetail.class === "outside" ||
                  budgetDetail.class === "project" ||
                  (budgetDetail.class === "room" && (
                    <>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          利用目的
                        </TableCell>
                        <TableCell>{budgetDetail.purpose}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          予定金額
                        </TableCell>
                        <TableCell>{budgetDetail.budget} 円</TableCell>
                      </TableRow>
                    </>
                  ))}
                {budgetDetail.status === "approve" ||
                  budgetDetail.status === "bought" ||
                  (budgetDetail.status === "paid" && (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        購入金額
                      </TableCell>
                      <TableCell>{budgetDetail.settlement} 円</TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell component="th" scope="row">
                    備考
                  </TableCell>
                  <TableCell>{budgetDetail.remark}</TableCell>
                </TableRow>
                {budgetDetail.class === "outside" ||
                  budgetDetail.class === "project" ||
                  (budgetDetail.class === "room" && (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        スレッド
                      </TableCell>
                      <TableCell>
                        {budgetDetail.mattermostUrl &&
                          new URL(budgetDetail.mattermostUrl).hostname === "mm.digicre.net" && (
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
                          )}
                      </TableCell>
                    </TableRow>
                  ))}

                <TableRow>
                  <TableCell component="th" scope="row">
                    申請者
                  </TableCell>
                  <TableCell>{budgetDetail.proposer.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    申請日時
                  </TableCell>
                  <TableCell>
                    {dayjs(budgetDetail.createdAt).format("YYYY/MM/DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    更新日時
                  </TableCell>
                  <TableCell>
                    {dayjs(budgetDetail.updatedAt).format("YYYY/MM/DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
                {(budgetDetail.status === "approve" ||
                  budgetDetail.status === "bought" ||
                  budgetDetail.status === "paid") && (
                  <>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        承認者
                      </TableCell>
                      <TableCell>
                        {budgetDetail.approver?.username ||
                          `(${classDisplay[budgetDetail.class as keyof typeof classDisplay]}のため自動承認)`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        承認日時
                      </TableCell>
                      <TableCell>
                        {dayjs(budgetDetail.approvedAt || budgetDetail.createdAt).format(
                          "YYYY/MM/DD HH:mm:ss",
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        領収書
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1} maxWidth="min(500px, 50vw)">
                          {budgetDetail.files &&
                            budgetDetail.files.map((f) => (
                              <BudgetFileView fileId={f.fileId} key={f.fileId} />
                            ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </>
  );
};

export default BudgetDetailPage;

export const getServerSideProps: GetServerSideProps<BudgetDetailPageProps> = async ({
  params,
  query,
  req,
}) => {
  const id = params?.id;
  if (!id || typeof id !== "string") return { notFound: true };
  const { mode } = query;
  const modeStr = typeof mode === "string" ? mode : undefined;
  const client = createServerApiClient(req);
  const res = await client.GET("/budget/{budgetId}", {
    params: { path: { budgetId: id } },
  });
  if (!res.data) return { notFound: true };
  return { props: { id, modeStr, budget: res.data as BudgetDetail } };
};
