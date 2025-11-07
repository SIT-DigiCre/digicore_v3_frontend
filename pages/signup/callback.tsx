import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Stack, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import { useAuthState } from "../../hook/useAuthState";
import { useRegisterData } from "../../hook/useRegisterData";

type Props = {
  code: string;
};
const LoginCallbackPage = ({ code }: Props) => {
  const { setCallbackCode } = useRegisterData();
  const router = useRouter();
  const { onLogin } = useAuthState();

  useEffect(() => {
    setCallbackCode(code).then((jwt) => {
      onLogin(jwt);
      router.push("/register/public");
    });
  }, []);

  return (
    <Stack alignItems="center" mt={20}>
      <Heading level={4}>登録処理中...</Heading>
      <Typography variant="body1">
        （この画面が長時間出る場合は登録からやり直して下さい）
      </Typography>
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { code } = query;
    const codeStr = typeof code === "string" ? code : null;
    return { props: { code: codeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
export default LoginCallbackPage;
