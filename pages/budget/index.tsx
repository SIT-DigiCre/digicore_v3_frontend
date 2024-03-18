import {
  Container,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useRouter } from "next/router";
import PageHead from "../../components/Common/PageHead";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { NewBudgetDialog } from "../../components/Budget/NewBudgetDialog";
import { useState } from "react";
import { useBudgets } from "../../hook/budget/useBudget";
import { GetServerSideProps } from "next";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

type Props = {
  modeStr?: string;
  error?: string;
};

const BudgetPage = ({ modeStr, error }: Props) => {
  const router = useRouter();
  const { budgets } = useBudgets();
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  return (
    <Container>
      <PageHead title={modeStr === "admin" ? "★ 稟議" : "稟議"} />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: modeStr === "admin" ? "Budget (ADMIN)" : "Budget" },
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
          <h1 className="d-inlineblock">{modeStr === "admin" ? "稟議（管理者用）" : "稟議"}</h1>
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
                <TableCell>申請日</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                  <TableCell>{budget.name}</TableCell>
                  <TableCell>{budget.status}</TableCell>
                  <TableCell>{budget.class}</TableCell>
                  <TableCell>{budget.budget}</TableCell>
                  <TableCell>{budget.settlement}</TableCell>
                  <TableCell>{budget.proposer.username}</TableCell>
                  <TableCell title={budget.updatedAt}>
                    {new Date(budget.updatedAt).toLocaleString("ja-JP", dateOptions)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
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
