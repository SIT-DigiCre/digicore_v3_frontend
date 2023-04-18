import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "../../hook/useAuthState";
import { useLoginData } from "../../hook/useLoginData";

type Props = {
  code: string;
};
const LoginCallbackPage = ({ code }: Props) => {
  const { setCallbackCode } = useLoginData();
  const router = useRouter();
  const { onLogin } = useAuthState();
  useEffect(() => {
    setCallbackCode(code).then((jwt) => {
      onLogin(jwt);
      if (localStorage.getItem("backto")) {
        const backto = localStorage.getItem("backto");
        localStorage.removeItem("backto");
        router.push(backto);
      } else {
        router.push("/");
      }
    });
  }, []);
  return <>ログイン処理中... （この画面が長時間出る場合はログインからやり直して下さい）</>;
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
