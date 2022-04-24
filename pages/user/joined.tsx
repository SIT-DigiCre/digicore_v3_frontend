import { Button, Container, Grid, TextField, Typography } from "@mui/material";
const JoinedPage = () => {
  const slackInviteURL = "";
  const discordInviteURL = "";
  return (
    <>
      <Container>
        <Grid>
          <h2>デジクリへようこそ</h2>
          <Typography>
            これで入部処理は完了です。続いてデジクリで使っているSNSの登録を行いましょう
          </Typography>
        </Grid>
        <Grid>
          <h3>Slack</h3>
          <Typography>
            ※かならず大学のメールアドレス（shibaura-it.ac.jp）で登録してください
          </Typography>
          <Button href={slackInviteURL} variant="contained" target="_blank">
            Slackの招待URLを開く
          </Button>
        </Grid>
        <Grid>
          <h3>Discord</h3>
          <Typography>※かならず先ほど登録したアカウントで登録してください</Typography>
          <Button href={discordInviteURL} variant="contained" target="_blank">
            Discordの招待URLを開く
          </Button>
        </Grid>
      </Container>
    </>
  );
};

export default JoinedPage;
