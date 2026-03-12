import Link from "next/link";
import { useRouter } from "next/router";

import { Stack, Typography } from "@mui/material";

import Heading from "@/components/Common/Heading";
import { useAuthState } from "@/hook/useAuthState";
import { GRANT_BUDGET_ADMIN, GRANT_GROUP_ADMIN, GRANT_PAYMENT_ADMIN } from "@/utils/auth/grants";

type AccessControlProps = {
  children: React.ReactNode;
};

const getRequiredAdminGrantsByPath = (pathname: string): string[] | null => {
  if (!pathname.startsWith("/admin")) return null;
  if (pathname === "/admin") return [GRANT_BUDGET_ADMIN, GRANT_GROUP_ADMIN, GRANT_PAYMENT_ADMIN];
  if (pathname.startsWith("/admin/budget")) return [GRANT_BUDGET_ADMIN];
  if (pathname.startsWith("/admin/group")) return [GRANT_GROUP_ADMIN];
  if (pathname.startsWith("/admin/payment")) return [GRANT_PAYMENT_ADMIN];
  if (pathname.startsWith("/admin/grade-update")) return [GRANT_GROUP_ADMIN];
  return [GRANT_BUDGET_ADMIN, GRANT_GROUP_ADMIN, GRANT_PAYMENT_ADMIN];
};

const AccessControl = ({ children }: AccessControlProps) => {
  const { authState } = useAuthState();
  const router = useRouter();
  const isPublicPage =
    router.pathname.startsWith("/login") || router.pathname.startsWith("/signup");

  if (!authState.isLogined && !isPublicPage) {
    return (
      <Stack>
        <Heading level={2}>ログインが必要です</Heading>
        <Typography>
          このページはデジクリの部員のみが閲覧できます。
          <Link href="/login">ログインページ</Link>
          にアクセスしてログインしてください。
        </Typography>
      </Stack>
    );
  }

  const requiredAdminGrants = getRequiredAdminGrantsByPath(router.pathname);
  const hasAdminAccess =
    requiredAdminGrants === null
      ? true
      : requiredAdminGrants.some((grant) => authState.grants.includes(grant));

  if (!hasAdminAccess) {
    return (
      <Stack>
        <Heading level={2}>権限がありません</Heading>
        <Typography>
          このページを表示する権限がありません。
          <Link href="/">トップページ</Link>
          に戻ってください。
        </Typography>
      </Stack>
    );
  }

  return children;
};

export default AccessControl;
