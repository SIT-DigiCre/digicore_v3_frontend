import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { MattermostRegister } from "@/components/Mattermost/Register";
import { TutorialStepLayout } from "@/components/Register/TutorialStepLayout";

const TutorialMattermostPage = () => {
  const router = useRouter();

  const handleRegistered = () => {
    router.push("/tutorial/mattermost-app");
  };

  const handlePrevious = () => {
    router.push("/tutorial/joined");
  };

  const handleSkip = () => {
    router.push("/tutorial/mattermost-app");
  };

  return (
    <TutorialStepLayout
      title="Mattermost登録"
      step={5}
      showNext={false}
      onPrevious={handlePrevious}
    >
      <Stack spacing={3}>
        <Typography>
          Mattermostは部内の主要チャットツールです。以下の手順で登録を行ってください。
        </Typography>

        <Box textAlign="right" sx={{ mb: 2 }}>
          <Button onClick={handleSkip} variant="contained" color="warning">
            既にMattermostは登録しているのでスキップする
          </Button>
        </Box>

        <MattermostRegister onRegistered={handleRegistered} />
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialMattermostPage;
