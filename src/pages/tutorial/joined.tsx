import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { TutorialStepLayout } from "@/components/Register/TutorialStepLayout";

const TutorialJoinedWelcomePage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/tutorial/mattermost");
  };

  const handlePrevious = () => {
    router.push("/tutorial/introduction");
  };

  return (
    <TutorialStepLayout title="入部完了！" step={4} onNext={handleNext} onPrevious={handlePrevious}>
      <Stack spacing={4} alignItems="center">
        <Box>
          <Typography variant="h5">入部処理が完了しました！</Typography>
        </Box>

        <Box sx={{ border: 1, borderColor: "info.main", borderRadius: 1, p: 3 }}>
          <Typography variant="body1" gutterBottom>
            <strong>デジクリで使用するSNSの設定を行います。</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            デジクリでは以下のプラットフォームを使用して、部員同士で交流しています:
          </Typography>

          <Box sx={{ ml: 2, mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              <strong>💬 Mattermost</strong> - 部内チャット・連絡
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>🎮 Discord</strong> - ボイスチャット・作品共有
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            これらのアカウント設定を進めましょう！
          </Typography>
        </Box>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialJoinedWelcomePage;
