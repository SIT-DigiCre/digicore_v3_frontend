import { useRouter } from "next/router";

import { Avatar, Button, Card, CardHeader, Grid } from "@mui/material";

import { useUserProfiles } from "../../hook/user/useUserProfiles";

const UserIndexPage = () => {
  const { userProfiles, requestMoreProfiles } = useUserProfiles();
  const router = useRouter();

  return (
    <>
      <Grid>
        <h1>ユーザー一覧</h1>
        <hr />
      </Grid>
      <Grid container>
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
      </Grid>
      <Grid sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            requestMoreProfiles();
          }}
        >
          Load More
        </Button>
      </Grid>
    </>
  );
};

export default UserIndexPage;
