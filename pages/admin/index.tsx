import Link from "next/link";

import { CurrencyYen, Groups, ReceiptLong } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

import PageHead from "../../components/Common/PageHead";

const AdminPage = () => {
  return (
    <>
      <PageHead title="[管理者用] ポータル" />
      <Stack spacing={2}>
        <Typography>このページは幹部およびインフラ担当のみが閲覧できます。</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            href="/admin/budget"
            variant="contained"
            startIcon={<ReceiptLong />}
          >
            稟議管理
          </Button>
          <Button component={Link} href="/admin/group" variant="contained" startIcon={<Groups />}>
            グループ管理
          </Button>
          <Button
            component={Link}
            href="/admin/payment"
            variant="contained"
            startIcon={<CurrencyYen />}
          >
            部費振込管理
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default AdminPage;
