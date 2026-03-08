import Link from "next/link";

import { CurrencyYen, Groups, HowToReg, ReceiptLong } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

import PageHead from "@/components/Common/PageHead";
import { useAuthState } from "@/hook/useAuthState";
import { GRANT_BUDGET_ADMIN, GRANT_GROUP_ADMIN, GRANT_PAYMENT_ADMIN } from "@/utils/auth/grants";

const AdminPage = () => {
  const { authState } = useAuthState();
  const canAccessBudgetAdmin = authState.grants.includes(GRANT_BUDGET_ADMIN);
  const canAccessGroupAdmin = authState.grants.includes(GRANT_GROUP_ADMIN);
  const canAccessPaymentAdmin = authState.grants.includes(GRANT_PAYMENT_ADMIN);
  // TODO: まだバックエンドで再入部申請を許可するgrantを用意していないので、とりあえず同じようにインフラ権限が持つグループ管理者権限で管理する
  const canAccessReentryAdmin = canAccessGroupAdmin;
  const hasAnyAdminMenu =
    canAccessBudgetAdmin || canAccessGroupAdmin || canAccessPaymentAdmin || canAccessReentryAdmin;

  return (
    <>
      <PageHead title="[管理者用] ポータル" />
      <Stack spacing={2}>
        <Typography>このページは管理者権限（grant）を持つユーザーのみが閲覧できます。</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {canAccessBudgetAdmin && (
            <Button
              component={Link}
              href="/admin/budget"
              variant="contained"
              startIcon={<ReceiptLong />}
            >
              稟議管理
            </Button>
          )}
          {canAccessGroupAdmin && (
            <Button component={Link} href="/admin/group" variant="contained" startIcon={<Groups />}>
              グループ管理
            </Button>
          )}
          {canAccessPaymentAdmin && (
            <Button
              component={Link}
              href="/admin/payment"
              variant="contained"
              startIcon={<CurrencyYen />}
            >
              部費振込管理
            </Button>
          )}
          {canAccessReentryAdmin && (
            <Button
              component={Link}
              href="/admin/reentry"
              variant="contained"
              startIcon={<HowToReg />}
            >
              再入部申請管理
            </Button>
          )}
        </Stack>
        {!hasAnyAdminMenu && (
          <Typography color="error">利用可能な管理者メニューがありません。</Typography>
        )}
      </Stack>
    </>
  );
};

export default AdminPage;
