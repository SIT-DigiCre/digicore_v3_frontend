import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Chip,
  Pagination,
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

import PageHead from "../../../components/Common/PageHead";
import { budgetStatusColor, classDisplay, statusDisplay } from "../../../utils/budget/constants";
import { createServerApiClient } from "../../../utils/fetch/client";

const ITEMS_PER_PAGE = 10;

export const getServerSideProps = async ({ req, query }) => {
  const client = createServerApiClient(req);
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const budgetsRes = await client.GET("/budget", {
      params: {
        query: {
          offset,
        },
      },
    });
    if (!budgetsRes.data || !budgetsRes.data.budgets) {
      return { props: { budgets: [], currentPage: 1, hasNextPage: false } };
    }

    const budgets = budgetsRes.data.budgets;
    const hasNextPage = budgets.length === ITEMS_PER_PAGE;

    return { props: { budgets, currentPage: page, hasNextPage } };
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return { props: { budgets: [], currentPage: 1, hasNextPage: false } };
  }
};

const AdminBudgetIndexPage = ({
  budgets,
  currentPage,
  hasNextPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    router.push({
      pathname: router.pathname,
      query: { page },
    });
  };

  const totalPages = hasNextPage ? currentPage + 1 : currentPage;

  return (
    <>
      <PageHead title="★ 稟議（管理者用）" />
      <Stack spacing={2}>
        {budgets && budgets.length > 0 ? (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
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
                        <Link href={`/admin/budget/${budget.budgetId}`}>{budget.name}</Link>
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
                        {dayjs(budget.updatedAt).format("YYYY/MM/DD HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack alignItems="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </>
        ) : (
          <Typography my={2}>稟議がありません</Typography>
        )}
      </Stack>
    </>
  );
};

export default AdminBudgetIndexPage;
