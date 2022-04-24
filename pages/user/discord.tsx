import { Grid, Button, Container } from "@mui/material";
import { baseURL } from "../../utils/common";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useAuthState } from "../../hook/useAuthState";
import { axios } from "../../utils/axios";

type Props = {
  code: string;
  isLoginFailed;
};
const DiscordCodePage = ({ code, isLoginFailed }: Props) => {
  const { authState } = useAuthState();
  const router = useRouter();
  useEffect(() => {
    if (isLoginFailed) return;
    if (authState.isLoading) return;
    axios
      .put(
        "/user/my/discord",
        { code: code },
        {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        },
      )
      .then(() => {
        router.push("/user/profile");
      });
  }, [authState]);
  return <>{isLoginFailed ? <h1>ログイン失敗</h1> : <h1>ログイン完了。リダイレクトします。</h1>}</>;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.query;
  let userId = "";
  if (typeof code === "string") userId = code;
  const props: Props = { isLoginFailed: !(typeof userId === "string"), code: userId };
  return {
    props: props,
  };
};
export default DiscordCodePage;
