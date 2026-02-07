import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { FilterList } from "@mui/icons-material";
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
import Pagination from "../../components/Common/Pagination";
import { budgetStatusColor, classDisplay, statusDisplay } from "../../utils/budget/constants";
import { createServerApiClient } from "../../utils/fetch/client";

const ITEMS_PER_PAGE = 10;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const rawPage = query.page ? parseInt(query.page as string, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
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
      return {
        props: {
          budgets: [],
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const budgets = budgetsRes.data.budgets;
    const hasNextPage = budgets.length === ITEMS_PER_PAGE;
    const hasPreviousPage = page > 1;

    return {
      props: {
        budgets,
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

const BudgetPage = ({
  budgets,
  currentPage,
  hasNextPage,
  hasPreviousPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <PageHead title="稟議" />
      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => {
          setOpenNewBudgetDialog(false);
        }}
      />
      <Stack spacing={2}>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <ButtonLink href="/budget/my" startIcon={<FilterList />} variant="text">
            自分の稟議を見る
          </ButtonLink>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenNewBudgetDialog(true);
            }}
          >
            新規稟議申請
          </Button>
        </Stack>
        {budgets && budgets.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="稟議一覧">
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
                      <Link href={`/budget/${budget.budgetId}`}>
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
        {budgets && budgets.length > 0 && (
          <Stack alignItems="center">
            <Pagination
              page={currentPage}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              onChange={(page) =>
                router.push({
                  pathname: router.pathname,
                  query: { page },
                })
              }
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default BudgetPage;
