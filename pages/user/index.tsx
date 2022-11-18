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
      <Grid>
        {userProfiles.map((userProfile) => (
          <Card
            sx={{ width: "32%", display: "inline-block", m: 0.5 }}
            onClick={() => {
              router.push(`/user/${userProfile.userId}`);
            }}
            className="clickable"
            key={userProfile.userId}
          >
            <CardHeader
              avatar={<Avatar src={userProfile.iconUrl} />}
              title={userProfile.username}
              subheader={userProfile.shortSelfIntroduction}
            ></CardHeader>
          </Card>
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
