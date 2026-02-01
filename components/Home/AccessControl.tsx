import Link from "next/link";
import { useRouter } from "next/router";

import { Stack, Typography } from "@mui/material";


import { useAuthState } from "../../hook/useAuthState";
import Heading from "../Common/Heading";

type AccessControlProps = {
  children: React.ReactNode;
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

  const isAdmin = authState?.user?.isAdmin ?? false;
  const isAdminPage = router.pathname.startsWith("/admin");
  if (!isAdmin && isAdminPage) {
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
