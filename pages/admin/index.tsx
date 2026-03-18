import { CurrencyYen, Groups, HowToReg, Logout, ReceiptLong, School } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";

import AdminMenuCard from "@/components/Admin/AdminMenuCard";
import PageHead from "@/components/Common/PageHead";
import { useAuthState } from "@/hook/useAuthState";
import { GRANT_ACCOUNT, GRANT_INFRA } from "@/utils/auth/grants";

const AdminPage = () => {
  const { authState } = useAuthState();
  const canAccessBudgetAdmin = authState.grants.includes(GRANT_ACCOUNT);
  const canAccessForceCheckoutAdmin = authState.grants.includes(GRANT_INFRA);
  const canAccessGroupAdmin = authState.grants.includes(GRANT_INFRA);
  const canAccessPaymentAdmin = authState.grants.includes(GRANT_ACCOUNT);
  const canAccessGradeUpdateAdmin = authState.grants.includes(GRANT_INFRA);
  const canAccessReentryAdmin = authState.grants.includes(GRANT_INFRA);
  const hasAnyAdminMenu =
    canAccessBudgetAdmin ||
    canAccessForceCheckoutAdmin ||
    canAccessGroupAdmin ||
    canAccessPaymentAdmin;

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
            {canAccessForceCheckoutAdmin && (
              <AdminMenuCard
                href="/admin/activity"
                icon={Logout}
                title="強制チェックアウト"
                description="在室中の部員を管理者権限で強制退室させます。"
              />
            )}
            {canAccessGradeUpdateAdmin && (
              <AdminMenuCard
                href="/admin/grade-update"
                icon={School}
                title="学年補正申請管理"
                description="部員からの学年補正申請を確認・承認・却下します。"
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
