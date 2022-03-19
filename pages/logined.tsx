import { Grid, Button, Container } from "@mui/material";
import { Google } from "@mui/icons-material";
import { baseURL } from "../utils/common";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { GetServerSideProps } from "next";
type Props = {
  isLoginFailed: boolean;
};
const LoginResultPage = ({ isLoginFailed }: Props) => {
  const router = useRouter();
  useEffect(() => {
    if (!isLoginFailed) router.push("/");
  }, []);
  return (
    <>
      <Container>
        <Grid xs={12} justifyItems="center">
          {isLoginFailed ? <h2>ログイン失敗</h2> : <h2>ホームページに移動します</h2>}
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session } = context.query;
  if (typeof session === "string") setCookie(context, "session", session);
  const props: Props = { isLoginFailed: !(typeof session === "string") };
  return {
    props: props,
  };
};
export default LoginResultPage;
