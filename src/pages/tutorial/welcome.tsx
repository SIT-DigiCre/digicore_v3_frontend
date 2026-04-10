import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { TutorialStepLayout } from "../../components/Register/TutorialStepLayout";

const TutorialWelcomePage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/tutorial/public-profile");
  };

  return (
    <TutorialStepLayout
      title="デジクリへようこそ！"
      step={0}
      onNext={handleNext}
      showPrevious={false}
    >
      <Stack spacing={4} alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom>
            これからデジコアの登録を進めていきます
          </Typography>
          <Typography>以下の10個のステップで、デジコアの設定が完了します。</Typography>
        </Box>
        <Box sx={{ bgcolor: "background.paper", border: "1px solid gray", borderRadius: 1, p: 3 }}>
          <Typography variant="body2" color="textSecondary">
            😊 各種情報を登録することで、デジクリのコミュニティの一部になります。
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            📝 途中でスキップできるステップもありますので、無理のないペースで進めてください。
          </Typography>
        </Box>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialWelcomePage;
