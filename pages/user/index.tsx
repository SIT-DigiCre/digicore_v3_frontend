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
              router.push(`/user/${userProfile.id}`);
            }}
            className="clickable"
            key={userProfile.id}
          >
            <CardHeader
              avatar={<Avatar src={userProfile.icon_url} />}
              title={userProfile.username}
              subheader={userProfile.short_self_introduction}
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
