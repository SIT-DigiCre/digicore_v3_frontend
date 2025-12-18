import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuthState } from "../../../hook/useAuthState";
import { apiClient } from "../../../utils/fetch/client";

type Props = {
  code: string;
  isLoginFailed: boolean;
};

const DiscordCallbackPage = ({ code, isLoginFailed }: Props) => {
  const router = useRouter();
  const { authState, refresh } = useAuthState();

  const onCallback = async () => {
    if (!authState.isLogined) return;
    await apiClient.PUT("/user/me/discord/callback", {
      body: { code: code },
      headers: {
        Authorization: "Bearer " + authState.token,
      },
    });
    if (localStorage.getItem("reg_discord") != null) {
      setTimeout(() => {
        refresh().then(() => {
          localStorage.removeItem("reg_discord");
          router.push("/register/discord");
        });
      }, 1000);
    } else {
      router.push("/user/profile");
    }
  };

  useEffect(() => {
    if (!authState.isLogined) return;
    onCallback();
  }, [authState]);

  if (isLoginFailed) return <p>Discord連携に失敗</p>;
  return <p>Discord連携作業中...（そのままお待ちください）</p>;
};

export default DiscordCallbackPage;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.query;
  let userId = "";
  if (typeof code === "string") userId = code;
  const props: Props = { isLoginFailed: !(typeof userId === "string"), code: userId };
  return {
    props: props,
  };
};
