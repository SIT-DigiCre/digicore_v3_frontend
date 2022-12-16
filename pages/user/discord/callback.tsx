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
  const { authState } = useAuthState();
  useEffect(() => {
    if (!authState.isLogined) return;
    setCallbackCode(code).then((res) => {
      if (localStorage.getItem("reg_discord")) {
        setTimeout(() => {
          router.push("/user/profile?register=true");
        }, 500);
      } else {
        router.push("/user/profile");
      }
    });
  }, [authState]);
  if (isLoginFailed) return <p>Discord連携に失敗</p>;
  return <></>;
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
