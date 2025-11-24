import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Add, FilterList } from "@mui/icons-material";
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
} from "@mui/material";
import dayjs from "dayjs";

import { NewBudgetDialog } from "../../components/Budget/NewBudgetDialog";
import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import { useBudgets } from "../../hook/budget/useBudget";
import { budgetStatusColor, classDisplay, statusDisplay } from "../../utils/budget/constants";

type MyBudgetPageProps = {
  modeStr?: string;
};

const MyBudgetPage = ({ modeStr }: MyBudgetPageProps) => {
  const router = useRouter();
  const { budgets, loadMore, isOver } = useBudgets("my");
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);

  return (
    <>
      <PageHead title={modeStr === "admin" ? "★ 自分の稟議" : "自分の稟議"} />
      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => {
          setOpenNewBudgetDialog(false);
        }}
      />
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {modeStr === "admin" ? (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push(`/budget`);
              }}
            >
              通常モードに戻る
            </Button>
          ) : (
            <ButtonLink href="/budget" startIcon={<FilterList />} variant="text">
              稟議一覧を見る
            </ButtonLink>
          )}
          {modeStr !== "admin" && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setOpenNewBudgetDialog(true);
              }}
            >
              新規稟議申請
            </Button>
          )}
        </Stack>
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
                        {dayjs(budget.updatedAt).format("YYYY/M/D H:mm")}
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
      </Stack>
      {!isOver && (
        <Stack alignItems="center" my={2}>
          <Button variant="contained" onClick={() => loadMore()}>
            Load More
          </Button>
        </Stack>
      )}
    </>
  );
};

export default MyBudgetPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { mode } = query;
    const modeStr = typeof mode === "string" ? mode : null;
    return { props: { modeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
