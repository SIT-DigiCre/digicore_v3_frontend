import type { InferGetServerSidePropsType, NextApiRequest } from "next";

import { Box, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { ButtonLink } from "@/components/Common/ButtonLink";
import { TutorialStepLayout } from "@/components/Register/TutorialStepLayout";
import { createServerApiClient } from "@/utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const discordRes = await client.GET("/user/me/discord");

    if (!discordRes.data) {
      return { props: { loginUrl: null } };
    }

    return { props: { loginUrl: discordRes.data.url } };
  } catch (error) {
    console.error("Failed to fetch discord login url:", error);
    return { props: { loginUrl: null } };
  }
};

type TutorialDiscordPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TutorialDiscordPage = ({ loginUrl }: TutorialDiscordPageProps) => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/tutorial/discord-server");
  };

  const handlePrevious = () => {
    router.push("/tutorial/mattermost-app");
  };

  return (
    <TutorialStepLayout
      title="Discord連携"
      step={7}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <Stack spacing={3}>
        <Typography>
          デジクリではDiscordサーバーを所有しています。正規の部員のみがDiscordサーバーに入れるようにアカウントと連携が必要です。
        </Typography>
        <Typography>
          Discordアカウントを持っていない方は先に
          <Link href="https://discord.com/register" target="_blank" rel="noopener noreferrer">
            Discordの登録ページ
          </Link>
          からアカウント作成を行いましょう。大学のメールアドレスで作る必要はありません！
        </Typography>

        {loginUrl ? (
          <Box mt={4} textAlign="center">
            <ButtonLink href={loginUrl} variant="contained">
              Discord連携
            </ButtonLink>
            <Typography sx={{ mt: 2 }} color="textSecondary">
              連携後、最初のページに戻って続行ボタンを押してください
            </Typography>
          </Box>
        ) : (
          <Typography color="error">Discordの認証情報が取得できませんでした</Typography>
        )}
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialDiscordPage;
