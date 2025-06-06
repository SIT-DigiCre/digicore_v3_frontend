import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import FloatingWindow from "../../components/Common/FloatingWindow";
import PageHead from "../../components/Common/PageHead";
import ProfileEditor from "../../components/Profile/ProfileEditor";
import ProfileRegister from "../../components/Profile/ProfileRegister";
import { useAuthState } from "../../hook/useAuthState";

type Props = {
  registerMode: boolean;
  backtoUrl: string | null;
};
const ProfilePage = ({ registerMode, backtoUrl }: Props) => {
  const router = useRouter();
  const { authState } = useAuthState();

  useEffect(() => {
    const value = sessionStorage.getItem("register");
    if (value === null) return;
    sessionStorage.removeItem("register");
    router.push("/user/joined");
  }, []);

  return (
    <>
      <PageHead title="Profile編集" />
      {authState.isLoading || !authState.isLogined ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Profile" }]} />
          {registerMode ? <ProfileRegister /> : <ProfileEditor />}
          {backtoUrl ? <FloatingWindow to={backtoUrl} text={"Mattermostの登録に戻る"} /> : <></>}
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { register, backto } = context.query;
  let registerMode = false;
  let backtoUrl: string | null = null;
  if (typeof register === "string") registerMode = register === "true";
  if (typeof backto === "string") backtoUrl = backto;
  const props: Props = { registerMode: registerMode, backtoUrl: backtoUrl };
  return {
    props: props,
  };
};
export default ProfilePage;
