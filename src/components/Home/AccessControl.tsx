import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

import Heading from "@/components/Common/Heading";
import { useAuthState } from "@/hook/useAuthState";
import { getRequiredAdminGrantsByPath } from "@/utils/auth/admin";

type AccessControlProps = {
  children: React.ReactNode;
};

const AccessControl = ({ children }: AccessControlProps) => {
  const { authState } = useAuthState();
  const router = useRouter();
  const isPublicPage =
    router.pathname.startsWith("/login") || router.pathname.startsWith("/signup");

  if (authState.isLoading) {
    return null;
  }

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
