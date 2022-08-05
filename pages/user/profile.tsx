import { Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ProfileEditor from "../../components/Profile/ProfileEditor";
import ProfileRegister from "../../components/Profile/ProfileRegister";
import { useAuthState } from "../../hook/useAuthState";

type Props = {
  registerMode: boolean;
};
const ProfilePage = ({ registerMode }: Props) => {
  const router = useRouter();
  const { authState } = useAuthState();

  return (
    <>
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
