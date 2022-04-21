import { Grid, Button, Container } from "@mui/material";
import { Google } from "@mui/icons-material";
import { baseURL } from "../utils/common";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { GetServerSideProps } from "next";
import { useAuthState } from "../hook/useAuthState";
type Props = {
  isLoginFailed: boolean;
  token: string;
};
const RegisterResultPage = ({ isLoginFailed, token }: Props) => {
  const router = useRouter();
  const { authState, onLogin } = useAuthState();
  useEffect(() => {
    onLogin(token);
    if (!isLoginFailed) router.push("/user/profile/?register=true");
  }, []);
  return (
    <>
      <Container>
        <Grid item xs={12} justifyItems="center">
          {isLoginFailed ? <h2>登録失敗</h2> : <h2>アカウント編集に移動します</h2>}
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session } = context.query;
  let token = "";
  if (typeof session === "string") token = session;
  const props: Props = { isLoginFailed: !(typeof session === "string"), token: token };
  return {
    props: props,
  };
};
export default RegisterResultPage;
