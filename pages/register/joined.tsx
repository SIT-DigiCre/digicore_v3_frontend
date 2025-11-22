import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
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

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { MattermostRegister } from "../../components/Mattermost/Register";
import TransferClubFeeView from "../../components/Register/TransferClubFeeView";
import { useJoinData } from "../../hook/user/useJoinData";

const JoinedPage = () => {
  const [step, setStep] = useState(0);
  return (
    <>
      <PageHead title="デジクリへようこそ" />
      <Container>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
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
        <Stack spacing={8} alignItems="center">
          <Box>
            <Typography>これで入部処理は完了です。</Typography>
            <Typography>あと少しです！</Typography>
            <Typography>続いてデジクリで使っているSNSの登録を行いましょう。</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setStep(1);
            }}
          >
            次へ
          </Button>
        </Stack>
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
          <Typography>Mattermostへの登録が完了しました。</Typography>
          <Typography>続いてアプリのインストールを行いましょう。</Typography>
          <Typography mt={2}>
            <Link href="https://mattermost.com/apps/" target="_blank" rel="noopener noreferrer">
              アプリの取得はこちらから
            </Link>
          </Typography>
          <Typography mt={2}>
            アプリ起動後、以下のように設定し、先ほど作成したアカウントでログインください
          </Typography>
          <TableContainer component={Paper} sx={{ maxWidth: 250, my: 2, mx: "auto" }}>
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
        <Stack spacing={2}>
          <Stack spacing={2}>
            <Typography>
              Discordでは、VC（ボイスチャット）を使用した雑談や趣味の交流、作品の途中経過などを投稿しています。
            </Typography>
            <Typography>
              本日から参加可能です! 是非VC（ボイスチャット）などに参加して交流しましょう!
            </Typography>
            <Typography>
              夜に作業配信や雑談をしている部員が多いです。気兼ねなく入って雑談してみましょう。
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              href={joinData?.discordUrl}
              variant="contained"
              target="_blank"
              rel="noopener noreferrer"
              disabled={!joinData?.discordUrl}
            >
              Discordの招待URLを開く
            </Button>
            <Typography>※かならず先ほど登録したDiscordアカウントで登録してください</Typography>
          </Stack>
          <Heading level={3}>主なボイスチャンネルやテキストチャット</Heading>
          <TableContainer component={Paper} sx={{ maxWidth: 500, my: 2, mx: "auto" }}>
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
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => {
                setStep(4);
              }}
              sx={{ mt: 2 }}
            >
              次へ
            </Button>
          </Stack>
        </Stack>
      );
    case 4:
      return (
        <>
          <Heading level={2}>部費の振込について</Heading>
          <Box>
            <Typography>
              手数料抜きで2000円の部費を<b>3週間以内</b>
              に、下記の口座に振り込んでください。デジクリの口座はゆうちょ銀行です。
            </Typography>
            <Typography>
              部費の振込が完了した際はデジコア上の
              <Link href="/user/form/payment">部費振込報告フォーム</Link>
              から振込完了報告をする必要があります
            </Typography>
            <Typography>
              期限を過ぎても振込完了報告がされない場合、メールにて会計から確認の連絡が届きます。それらに反応が無い場合、デジコアやMattermost、Discordのアカウント制限がかかります。
            </Typography>
          </Box>
          <TransferClubFeeView />
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={() => {
                router.push("/");
              }}
              sx={{ mt: 2 }}
            >
              ホームへ
            </Button>
          </Box>
        </>
      );
  }
};
