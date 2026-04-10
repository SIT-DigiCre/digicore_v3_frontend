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
            部費 2,000円 を<b>3週間以内</b>に、下記の口座に振り込んでください。
          </Typography>
          <Typography sx={{ mt: 2 }}>
            振込が完了したらデジコア上の
            <NextLink href="/user/form/payment">
              <Link component="span">部費振込報告フォーム</Link>
            </NextLink>
            から振込完了報告をしてください。
          </Typography>
          <Typography sx={{ mt: 2 }}>
            期限を過ぎても振込完了報告がされない場合、デジコアやMattermost、Discordの利用が制限されることがあります。
          </Typography>
        </Box>

        <TransferClubFeeView />

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button variant="contained" size="large" onClick={handleHome}>
            チュートリアル完了！
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            いつでもサイドバーから部費振込報告ができます
          </Typography>
        </Box>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialClubFeePage;
