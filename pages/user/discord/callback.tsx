import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";
import { useAuthState } from "../../../hook/useAuthState";
type Props = {
  code: string;
  isLoginFailed;
};
const DiscordCallbackPage = ({ code, isLoginFailed }: Props) => {
  const { setCallbackCode } = useDiscordLogin();
  const router = useRouter();
  const { authState, refresh } = useAuthState();
  useEffect(() => {
    if (!authState.isLogined) return;
    setCallbackCode(code)
      .then(() => {
        if (localStorage.getItem("reg_discord") != null) {
          setTimeout(() => {
            refresh().then(() => {
              localStorage.removeItem("reg_discord");
              router.push("/user/profile?register=true");
            });
          }, 1000);
        } else {
          router.push("/user/profile");
        }
      })
      .catch((e) => console.log(e));
  }, [authState]);
  if (isLoginFailed) return <p>Discord連携に失敗</p>;
  return <>Discord連携作業中...（そのままお待ちください）</>;
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
