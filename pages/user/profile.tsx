import { Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useEffect } from "react";
import PageHead from "../../components/Common/PageHead";
import ProfileEditor from "../../components/Profile/ProfileEditor";
import ProfileRegister from "../../components/Profile/ProfileRegister";
import { useAuthState } from "../../hook/useAuthState";

type Props = {
  registerMode: boolean;
};
const ProfilePage = ({ registerMode }: Props) => {
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
        <p>Loading...</p>
      ) : (
        <Container>
          <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Profile" }]} />
          {registerMode ? <ProfileRegister registerMode={registerMode} /> : <ProfileEditor />}
        </Container>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { register } = context.query;
  let registerMode = false;
  if (typeof register === "string") registerMode = register === "true";
  const props: Props = { registerMode: registerMode };
  return {
    props: props,
  };
};
export default ProfilePage;
