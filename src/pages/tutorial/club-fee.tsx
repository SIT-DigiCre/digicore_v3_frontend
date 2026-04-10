import { Box, Button, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";

import Heading from "../../components/Common/Heading";
import TransferClubFeeView from "../../components/Register/TransferClubFeeView";
import { TutorialStepLayout } from "../../components/Register/TutorialStepLayout";

const TutorialClubFeePage = () => {
  const router = useRouter();

  const handlePrevious = () => {
    router.push("/tutorial/discord-server");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <TutorialStepLayout title="部費振込" step={9} onPrevious={handlePrevious} showNext={false}>
      <Stack spacing={3}>
        <Heading level={2}>部費の振込について</Heading>
        <Box>
          <Typography>
            手数料抜きで2000円の部費を<b>3週間以内</b>
            に、下記の口座に振り込んでください。デジクリの口座はゆうちょ銀行です。
          </Typography>
          <Typography sx={{ mt: 2 }}>
            部費の振込が完了した際はデジコア上の
            <NextLink href="/user/form/payment">
              <Link component="span">部費振込報告フォーム</Link>
            </NextLink>
            から振込完了報告をする必要があります。
          </Typography>
          <Typography sx={{ mt: 2 }}>
            期限を過ぎても振込完了報告がされない場合、メールにて会計から確認の連絡が届きます。それらに反応が無い場合、デジコアやMattermost、Discordのアカウント制限がかかります。
          </Typography>
        </Box>

        <TransferClubFeeView />

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button variant="contained" size="large" onClick={handleHome}>
            チュートリアル完了！ホームへ
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            いつでもマイページから部費振込報告ができます
          </Typography>
        </Box>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialClubFeePage;
