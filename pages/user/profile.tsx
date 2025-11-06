import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import FloatingWindow from "../../components/Common/FloatingWindow";
import PageHead from "../../components/Common/PageHead";
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
    router.push("/register/joined");
  }, []);

  useEffect(() => {
    if (registerMode) {
      router.replace("/user/register/public");
    } else {
      router.replace("/user/profile/public");
    }
  }, [registerMode, router]);

  return (
    <>
      <PageHead title="Profile編集" />
      {authState.isLoading || !authState.isLogined ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <div>
            <p>リダイレクト中...</p>
          </div>
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
