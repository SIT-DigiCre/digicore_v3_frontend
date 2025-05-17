import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
      router.push("/user/profile?register=true");
    });
  }, []);
  return <>初回ログイン処理中... （この画面が長時間出る場合は登録からやり直して下さい）</>;
};
export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const { code } = query;
    const codeStr = typeof code === "string" ? code : null;
    return { props: { code: codeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
export default LoginCallbackPage;
