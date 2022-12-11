import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";
type Props = {
  code: string;
  isLoginFailed;
};
const DiscordCallbackPage = ({ code, isLoginFailed }: Props) => {
  const { setCallbackCode } = useDiscordLogin();
  const router = useRouter();
  if (isLoginFailed) return <p>Discord連携に失敗</p>;
  setCallbackCode(code).then((res) => {
    if (localStorage.getItem("reg_discord")) {
      router.push("/user/profile?register=true");
    } else {
      router.push("/user/profile");
    }
  });
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
