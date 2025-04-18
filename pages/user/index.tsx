import { Avatar, Button, Card, CardHeader, Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useUserProfiles } from "../../hook/user/useUserProfiles";

const UserIndexPage = () => {
  const { userProfiles, requestMoreProfiles } = useUserProfiles();
  const router = useRouter();
  return (
    <Container>
      <Grid>
        <h1>ユーザー一覧</h1>
        <hr />
      </Grid>
      <Grid container>
        {userProfiles.map((userProfile) => (
          <Grid size={[12, 6, 4]} sx={{ padding: 0.5 }}>
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
    </Container>
  );
};

export default UserIndexPage;
