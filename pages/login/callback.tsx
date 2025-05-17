import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";

import { useAuthState } from "../../hook/useAuthState";
import { useLoginData } from "../../hook/useLoginData";

type Props = {
  code: string;
};
const centerTextStyle: CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "20px",
};
const LoginCallbackPage = ({ code }: Props) => {
  const { setCallbackCode } = useLoginData();
  const router = useRouter();
  const { onLogin } = useAuthState();
  const [logining, setLogining] = useState(true);
  useEffect(() => {
    setCallbackCode(code)
      .then((jwt) => {
        onLogin(jwt);
        if (localStorage.getItem("backto")) {
          const backto = localStorage.getItem("backto");
          localStorage.removeItem("backto");
          router.push(backto);
        } else {
          router.push("/");
        }
      })
      .catch((e) => {
        console.error(e);
        setLogining(false);
      });
  }, []);
  if (logining)
    return (
      <p style={centerTextStyle}>
        ログイン処理中... （この画面が長時間出る場合はログインからやり直して下さい）
      </p>
    );
  return (
    <div style={centerTextStyle}>
      <p>ログイン失敗</p>
      <br />
      <p>何度か試行しても解決できない場合はインフラサポートフォームをご利用ください</p>
      <a href="https://forms.gle/MQicA1No8LSZPe5QA" target="_blank" rel="noopener">
        サポートフォームを開く
      </a>
    </div>
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
