import { Container, Grid, Button } from "@mui/material";
import { useRouter } from "next/router";
import PageHead from "../../components/Common/PageHead";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { NewBudgetDialog } from "../../components/Budget/NewBudgetDialog";
import { useState } from "react";

const BudgetPage = () => {
  const router = useRouter();
  const [openNewBudgetDialog, setOpenNewBudgetDialog] = useState(false);
  return (
    <Container>
      <PageHead title="稟議" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "稟議" }]} />
      <NewBudgetDialog
        open={openNewBudgetDialog}
        onClose={() => {
          setOpenNewBudgetDialog(false);
        }}
      />
      <Grid>
        <div>
          <h1 className="d-inlineblock">稟議</h1>
          <div style={{ float: "right" }}>
            <Button
              variant="contained"
              sx={{ margin: "0.1rem" }}
              onClick={() => {
                setOpenNewBudgetDialog(true);
              }}
            >
              新規稟議申請
            </Button>
          </div>
        </div>
        <hr style={{ clear: "both" }} />
      </Grid>
      <Grid>
        <table>
          <tr>
            <th>表題</th>
            <th>状況</th>
            <th>種別</th>
            <th>予定金額</th>
            <th>購入金額</th>
            <th>申請者</th>
            <th>申請日</th>
          </tr>
        </table>
      </Grid>
    </Container>
  );
};

export default BudgetPage;
