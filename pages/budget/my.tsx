import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
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

  // まず現在のユーザー情報を取得
  const userRes = await client.GET("/user/me", {});

  // 認証エラー（401, 403）の場合はログインページへリダイレクト
  if (userRes.error) {
    const status = userRes.response.status;
    if (status === 401 || status === 403) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // それ以外のエラーは空配列とエラー情報を返す
    console.error("Failed to fetch user info:", userRes.error);
    return {
      props: {
        budgets: [],
        currentPage: 1,
        error: {
          message: `ユーザー情報の取得に失敗しました (HTTP ${status})`,
          status,
        },
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  if (!userRes.data || !userRes.data.userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const budgetsRes = await client.GET("/budget", {
    params: {
      query: {
        offset,
        proposerId: userRes.data.userId,
      },
    },
  });

  // 認証エラー（401, 403）の場合はログインページへリダイレクト
  if (budgetsRes.error) {
    const status = budgetsRes.response.status;
    if (status === 401 || status === 403) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // それ以外のエラー（404, 500など）は空配列とエラー情報を返す
    console.error("Failed to fetch my budgets:", budgetsRes.error);
    return {
      props: {
        budgets: [],
        currentPage: 1,
        error: {
          message: `稟議一覧の取得に失敗しました (HTTP ${status})`,
          status,
        },
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  if (!budgetsRes.data || !budgetsRes.data.budgets) {
    return {
      props: {
        budgets: [],
        currentPage: 1,
        error: null,
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
      error: null,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

const MyBudgetPage = ({
  budgets,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <PageHead title="自分の稟議" />
      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => {
          setOpenNewBudgetDialog(false);
        }}
      />
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <ButtonLink href="/budget" startIcon={<FilterList />} variant="text">
            稟議一覧を見る
          </ButtonLink>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setOpenNewBudgetDialog(true);
            }}
          >
            新規稟議申請
          </Button>
        </Stack>
        {error && (
          <Typography color="error" sx={{ bgcolor: "error.lighter", borderRadius: 1, p: 2 }}>
            {error.message}
          </Typography>
        )}
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
          <Typography>{error ? "" : "稟議がありません"}</Typography>
        )}
        {budgets && budgets.length > 0 && !error && (
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

export default MyBudgetPage;
