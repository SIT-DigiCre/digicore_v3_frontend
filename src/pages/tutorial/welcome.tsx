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
          <Typography variant="h5" gutterBottom align="center">
            デジクリへようこそ！
          </Typography>
        </Box>
        <Box sx={{ border: 1, borderColor: "info.main", borderRadius: 1, p: 3 }}>
          <Typography variant="body1" gutterBottom>
            <strong>まずは、デジコアに登録しましょう。</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            デジコアとは、デジクリが開発する独自のグループウェアです。
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            部費振込や会計処理、作品の共有などをすることができます。
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            デジコアに登録することで、デジクリへの入部が完了します！
          </Typography>
        </Box>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialWelcomePage;
