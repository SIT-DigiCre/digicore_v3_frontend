import type { InferGetServerSidePropsType, NextApiRequest } from "next";

import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { ButtonLink } from "../../components/Common/ButtonLink";
import Heading from "../../components/Common/Heading";
import { TutorialStepLayout } from "../../components/Register/TutorialStepLayout";
import { createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const toolRes = await client.GET("/tool");

    if (!toolRes.data) {
      return { props: { joinData: { discordUrl: null } } };
    }

    return { props: { joinData: toolRes.data } };
  } catch (error) {
    console.error("Failed to fetch join data:", error);
    return { props: { joinData: { discordUrl: null } } };
  }
};

type TutorialDiscordServerPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TutorialDiscordServerPage = ({ joinData }: TutorialDiscordServerPageProps) => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/tutorial/club-fee");
  };

  const handlePrevious = () => {
    router.push("/tutorial/discord");
  };

  return (
    <TutorialStepLayout
      title="Discordサーバー参加"
      step={8}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <Stack spacing={3}>
        <Typography>
          Discordでは、VC（ボイスチャット）を使用した雑談や趣味の交流、作品の途中経過などを投稿しています。
        </Typography>
        <Typography>
          本日から参加可能です! 是非VC（ボイスチャット）などに参加して交流しましょう!
        </Typography>
        <Typography>
          夜に作業配信や雑談をしている部員が多いです。気兼ねなく入って雑談してみましょう。
        </Typography>

        {joinData?.discordUrl ? (
          <Stack spacing={2}>
            <ButtonLink
              href={joinData.discordUrl}
              variant="contained"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discordの招待URLを開く
            </ButtonLink>
            <Typography variant="caption" color="textSecondary">
              ※かならず先ほど登録したDiscordアカウントで登録してください
            </Typography>
          </Stack>
        ) : (
          <Typography color="error">Discordの招待URLが取得できませんでした</Typography>
        )}

        <Heading level={3}>主なボイスチャンネルやテキストチャット</Heading>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>free VC / FREEDOM VC</strong>
                </TableCell>
                <TableCell>雑談など自由なVC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>work VC</strong>
                </TableCell>
                <TableCell>作業などをしながらおしゃべりするVC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>もくもく work VC</strong>
                </TableCell>
                <TableCell>黙々と作業をしたい人向けVC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>会議室 VC</strong>
                </TableCell>
                <TableCell>企画などの会議を行うVC、乱入注意!</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>vc-notf</strong>
                </TableCell>
                <TableCell>VCへの入退室記録。ミュート推奨</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>random</strong>
                </TableCell>
                <TableCell>VCで何をやっているかを投稿したりするチャンネル</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>ﾃｸﾆｶﾙｻﾎﾟｰﾄ</strong>
                </TableCell>
                <TableCell>PCの操作など困ったらここで質問しよう</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>課題相談</strong>
                </TableCell>
                <TableCell>授業で困ったことなどを相談しよう</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialDiscordServerPage;
