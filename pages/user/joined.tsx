import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { MattermostRegister } from "../../components/Mattermost/Register";
import TransferAccountView from "../../components/Register/TransferAccountView";
import { useJoinData } from "../../hook/user/useJoinData";

const JoinedPage = () => {
  const [step, setStep] = useState(0);
  return (
    <>
      <PageHead title="デジクリへようこそ" />
      <Container>
        <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Joined" }]} />
        <Grid>
          <h2>デジクリへようこそ</h2>
        </Grid>
        <Stepper activeStep={step} style={{ marginBottom: "10px", overflow: "auto" }}>
          <Step>
            <StepLabel>ようこそ</StepLabel>
          </Step>
          <Step>
            <StepLabel>Mattermost登録</StepLabel>
          </Step>
          <Step>
            <StepLabel>Mattermostアプリ</StepLabel>
          </Step>
          <Step>
            <StepLabel>Discord登録</StepLabel>
          </Step>
          <Step>
            <StepLabel>部費振込</StepLabel>
          </Step>
        </Stepper>
        <JoinedSteps step={step} setStep={setStep} />
      </Container>
    </>
  );
};

export default JoinedPage;
type StepsProps = { step: number; setStep: Dispatch<SetStateAction<number>> };
const JoinedSteps = ({ step, setStep }: StepsProps) => {
  const joinData = useJoinData();
  const router = useRouter();
  switch (step) {
    case 0:
      return (
        <Box textAlign="center">
          <Typography>
            これで入部処理は完了です。あと少しです。続いてデジクリで使っているSNSの登録を行いましょう。
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setStep(1);
            }}
            sx={{ mt: 2 }}
          >
            次へ
          </Button>
        </Box>
      );
    case 1:
      return (
        <>
          <Box textAlign="right">
            <Button
              onClick={() => {
                setStep(2);
              }}
              variant="contained"
              color="warning"
            >
              既にMattermostは登録しているのでスキップする
            </Button>
          </Box>

          <MattermostRegister
            onRegistered={() => {
              setStep(2);
            }}
          />
        </>
      );
    case 2:
      return (
        <Box textAlign="center">
          <Typography>
            Mattermostへの登録が完了しました。
            <br />
            続いてアプリのインストールを行いましょう。
          </Typography>
          <Typography marginTop={2}>
            <a href="https://mattermost.com/apps/" target="_blank" rel="noreferrer">
              アプリの取得はこちらから
            </a>
          </Typography>
          <Typography marginTop={2}>
            アプリ起動後、以下のように設定し、先ほど作成したアカウントでログインください
          </Typography>
          <TableContainer component={Paper} sx={{ maxWidth: 250, margin: "10px auto" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>サーバーURL</TableCell>
                  <TableCell>mm.digicre.net</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>サーバー名</TableCell>
                  <TableCell>デジクリ</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={() => {
              setStep(3);
            }}
            sx={{ mt: 2 }}
          >
            次へ
          </Button>
        </Box>
      );
    case 3:
      return (
        <Box textAlign="center">
          <Typography>
            Discordでは、VC（ボイスチャット）を使用した雑談や趣味の交流、作品の途中経過などを投稿しています。
          </Typography>
          <Typography marginTop={2}>
            ※かならず先ほど登録したDiscordアカウントで登録してください
          </Typography>
          <Button href={joinData.discordUrl} variant="contained" target="_blank">
            Discordの招待URLを開く
          </Button>
          <Typography marginTop={2}>
            本日から参加可能です! 是非VC（ボイスチャット）などに参加して交流しましょう!
          </Typography>
          <Typography marginTop={1}>
            夜に作業配信や雑談をしている部員が多いです。気兼ねなく入って雑談してみましょう。
          </Typography>
          <Typography variant="h3" fontSize={20} marginTop={2}>
            主なVoiceChatやTextChat
          </Typography>
          <TableContainer component={Paper} sx={{ maxWidth: 500, margin: "10px auto" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>free VC / FREEDOM VC</TableCell>
                  <TableCell>雑談など自由なVC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>work VC</TableCell>
                  <TableCell>作業などをしながらおしゃべりするVC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>もくもく work VC</TableCell>
                  <TableCell>黙々と作業をしたい人向けVC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>会議室 VC</TableCell>
                  <TableCell>企画などの会議を行うVC、乱入注意!</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>vc-notf</TableCell>
                  <TableCell>VCへの入退室記録。ミュート推奨</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>random</TableCell>
                  <TableCell>VCで何をやっているかを投稿したりするチャンネル</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ﾃｸﾆｶﾙｻﾎﾟｰﾄ</TableCell>
                  <TableCell>PCの操作など困ったらここで質問しよう</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>課題相談</TableCell>
                  <TableCell>授業で困ったことなどを相談しよう</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={() => {
              setStep(4);
            }}
            sx={{ mt: 2 }}
          >
            次へ
          </Button>
        </Box>
      );
    case 4:
      return (
        <>
          <TransferAccountView />
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={() => {
                router.push("/");
              }}
              sx={{ mt: 2 }}
            >
              Homeへ
            </Button>
          </Box>
        </>
      );
  }
};
