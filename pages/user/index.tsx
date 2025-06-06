import { useRouter } from "next/router";

import { Avatar, Card, CardHeader, Grid } from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import { useUserProfiles } from "../../hook/user/useUserProfiles";

const UserIndexPage = () => {
  const { userProfiles, requestMoreProfiles } = useUserProfiles();
  const router = useRouter();

  return (
    <>
      <PageHead title="部員一覧" />

      {userProfiles.map((userProfile) => (
        <Grid size={[12, 6, 4]} sx={{ padding: 0.5 }} key={userProfile.userId}>
          <Card
            onClick={() => {
              router.push(`/user/${userProfile.userId}`);
            }}
            className="clickable"
            key={userProfile.userId}
          >
            <CardHeader
              avatar={<Avatar src={userProfile.iconUrl} />}
              title={userProfile.username}
              subheader={userProfile.shortIntroduction}
            ></CardHeader>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default UserIndexPage;
