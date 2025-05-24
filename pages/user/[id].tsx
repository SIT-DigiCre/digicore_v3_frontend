import { GetServerSideProps } from "next";

import { Container } from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import MarkdownView from "../../components/Common/MarkdownView";
import { useIntroduction } from "../../hook/profile/useIntroduction";
import { useProfile } from "../../hook/profile/useProfile";

type Props = {
  id: string;
};
const UserProfilePage = ({ id }: Props) => {
  const profile = useProfile(id);
  const introMd = useIntroduction(id);
  if (!profile || introMd === undefined) return <p>Loading...</p>;
  return (
    <Container>
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: "User", href: "/user" },
          { text: profile.username },
        ]}
      />
      <div style={{ marginTop: "10px" }}>
        <div style={{ display: "inline-block", textAlign: "center", width: "30%" }}>
          <img
            src={profile.iconUrl}
            alt={profile.username + "のアイコン"}
            style={{ maxWidth: "100%", borderRadius: "50%" }}
          />
        </div>
        <div style={{ display: "inline-block", width: "70%", textAlign: "center" }}>
          <div style={{ margin: "20px" }}>
            <h1>{profile.username}</h1>
          </div>
          <div style={{ margin: "20px" }}>
            <p>{profile.shortIntroduction}</p>
          </div>
          <div style={{ margin: "20px" }}>
            <p>学年: {profile.schoolGrade}</p>
          </div>
        </div>
      </div>
      <div>
        <MarkdownView md={introMd} />
      </div>
    </Container>
  );
};
export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    return { props: { id } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
