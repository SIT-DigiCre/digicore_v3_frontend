import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { NewBudgetDialog } from "../../components/Budget/NewBudgetDialog";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useBudgets } from "../../hook/budget/useBudget";
import { BudgetClass, BudgetStatus } from "../../interfaces/budget";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

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

type Props = {
  modeStr?: string;
};

const BudgetPage = ({ modeStr }: Props) => {
  const router = useRouter();
  const { budgets, loadMore } = useBudgets("my");
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);

  return (
    <>
      <PageHead title={modeStr === "admin" ? "★ 自分の稟議" : "自分の稟議"} />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          modeStr === "admin"
            ? { text: "Budget (ADMIN)", href: "/budget?mode=admin" }
            : { text: "Budget", href: "/budget" },
          { text: "My" },
        ]}
      />
      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => {
          setOpenNewBudgetDialog(false);
        }}
      />
      <Grid>
        <div>
          <Heading level={2}>
            {modeStr === "admin" ? "自分の稟議（管理者用）" : "自分の稟議"}
          </Heading>
          <div style={{ float: "right" }}>
            {modeStr === "admin" ? (
              <Button
                variant="contained"
                color="error"
                sx={{ margin: "0.1rem" }}
                onClick={() => {
                  router.push(`/budget`);
                }}
              >
                通常モードに戻る
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ margin: "0.1rem" }}
                onClick={() => {
                  setOpenNewBudgetDialog(true);
                }}
              >
                新規稟議申請
              </Button>
            )}
          </div>
        </div>
        <hr style={{ clear: "both" }} />
      </Grid>
      <Grid container>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>表題</TableCell>
                <TableCell>状況</TableCell>
                <TableCell>種別</TableCell>
                <TableCell>予定金額</TableCell>
                <TableCell>購入金額</TableCell>
                <TableCell>申請者</TableCell>
                <TableCell>最終更新日</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets ? (
                <>
                  {budgets.map((budget) => (
                    <TableRow
                      key={budget.budgetId}
                      onClick={
                        modeStr === "admin"
                          ? () => {
                              router.push(`/budget/${budget.budgetId}?mode=admin`);
                            }
                          : () => {
                              router.push(`/budget/${budget.budgetId}`);
                            }
                      }
                      className="clickable-gray"
                    >
                      <TableCell>
                        {budget.name.length > 20 ? budget.name.substring(0, 20) + "…" : budget.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusDisplay[budget.status]}
                          color={budgetStatusColor[budget.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{classDisplay[budget.class]}</TableCell>
                      <TableCell>
                        {budget.class === "festival" || budget.class === "fixed"
                          ? "-"
                          : `${budget.budget} 円`}
                      </TableCell>
                      <TableCell>
                        {budget.status === "pending" || budget.status === "reject"
                          ? "-"
                          : `${budget.settlement} 円`}
                      </TableCell>
                      <TableCell>{budget.proposer.username}</TableCell>
                      <TableCell title={budget.updatedAt}>
                        {new Date(budget.updatedAt).toLocaleString("ja-JP", dateOptions)}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>稟議がありません</TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {showLoadMoreButton ? (
        <Grid sx={{ textAlign: "center", marginY: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              loadMore().then((result) => {
                if (!result) return;
                if (result.isLogined && result.reachedToEnd) setShowLoadMoreButton(false);
              });
            }}
          >
            Load More
          </Button>
        </Grid>
      ) : (
        <Grid sx={{ marginBottom: 3 }}></Grid>
      )}
    </>
  );
};

export default BudgetPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { mode } = query;
    const modeStr = typeof mode === "string" ? mode : null;
    return { props: { modeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
