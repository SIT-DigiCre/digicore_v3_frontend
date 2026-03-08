import { CurrencyYen, Groups, HowToReg, ReceiptLong } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";

import AdminMenuCard from "@/components/Admin/AdminMenuCard";
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
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            管理者ポータル
          </Typography>
          <Typography color="text.secondary">
            このページは管理者権限を持つユーザーのみが閲覧できます。
          </Typography>
        </Box>
        {hasAnyAdminMenu ? (
          <Grid container spacing={2}>
            {canAccessBudgetAdmin && (
              <AdminMenuCard
                href="/admin/budget"
                icon={ReceiptLong}
                title="稟議管理"
                description="部員からの稟議申請を確認・承認・却下します。"
              />
            )}
            {canAccessGroupAdmin && (
              <AdminMenuCard
                href="/admin/group"
                icon={Groups}
                title="グループ管理"
                description="部員のグループ（権限）を管理します。"
              />
            )}
            {canAccessPaymentAdmin && (
              <AdminMenuCard
                href="/admin/payment"
                icon={CurrencyYen}
                title="部費振込管理"
                description="部員の部費振込状況を確認・管理します。"
              />
            )}
            {canAccessReentryAdmin && (
              <AdminMenuCard
                href="/admin/reentry"
                icon={HowToReg}
                title="再入部申請管理"
                description="部員からの再入部申請を確認・承認・却下します。"
              />
            )}
          </Grid>
        ) : (
          <Typography color="error">利用可能な管理者メニューがありません。</Typography>
        )}
      </Stack>
    </>
  );
};

export default AdminPage;
