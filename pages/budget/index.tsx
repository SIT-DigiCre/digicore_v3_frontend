import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";

import { ArrowBack, FilterList } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Chip,
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

import { NewBudgetDialog } from "../../components/Budget/NewBudgetDialog";
import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import { useBudgets } from "../../hook/budget/useBudget";
import { budgetStatusColor, classDisplay, statusDisplay } from "../../utils/budget/constants";

type BudgetPageProps = {
  modeStr?: string;
};

const BudgetPage = ({ modeStr }: BudgetPageProps) => {
  const { budgets, loadMore, isOver } = useBudgets();
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);

  return (
    <>
      <PageHead title={modeStr === "admin" ? "★ 稟議（管理者用）" : "稟議"} />
      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => {
          setOpenNewBudgetDialog(false);
        }}
      />
      <Stack spacing={2}>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          {modeStr === "admin" ? (
            <ButtonLink href="/budget" startIcon={<ArrowBack />}>
              通常モードに戻る
            </ButtonLink>
          ) : (
            <ButtonLink href="/budget/my" startIcon={<FilterList />} variant="text">
              自分の稟議を見る
            </ButtonLink>
          )}
          {modeStr !== "admin" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenNewBudgetDialog(true);
              }}
            >
              新規稟議申請
            </Button>
          )}
        </Stack>
        {budgets && budgets.length > 0 ? (
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
                {budgets.map((budget) => (
                  <TableRow key={budget.budgetId}>
                    <TableCell>
                      <Link
                        href={
                          modeStr === "admin"
                            ? `/budget/${budget.budgetId}?mode=admin`
                            : `/budget/${budget.budgetId}`
                        }
                      >
                        {budget.name.length > 20 ? budget.name.substring(0, 20) + "…" : budget.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusDisplay[budget.status as keyof typeof statusDisplay]}
                        color={budgetStatusColor[budget.status as keyof typeof budgetStatusColor]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{classDisplay[budget.class as keyof typeof classDisplay]}</TableCell>
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
                    <TableCell>{budget.proposer?.username ?? "-"}</TableCell>
                    <TableCell title={budget.updatedAt}>
                      {dayjs(budget.updatedAt).format("YYYY/MM/DD HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>稟議がありません</Typography>
        )}
      </Stack>
      {!isOver && (
        <Stack alignItems="center" my={2}>
          <Button variant="contained" onClick={() => loadMore()}>
            もっと見る
          </Button>
        </Stack>
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
  } catch (error: unknown) {
    return { props: { errors: error instanceof Error ? error.message : "An unknown error occurred" } };
  }
};
