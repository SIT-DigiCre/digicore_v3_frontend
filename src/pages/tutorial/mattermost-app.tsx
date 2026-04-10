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
import Link from "next/link";
import { useRouter } from "next/router";

import { TutorialStepLayout } from "@/components/Register/TutorialStepLayout";

const TutorialMattermostAppPage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/tutorial/discord");
  };

  const handlePrevious = () => {
    router.push("/tutorial/mattermost");
  };

  return (
    <TutorialStepLayout
      title="Mattermostアプリ"
      step={6}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <Stack spacing={3}>
        <Typography>Mattermostへの登録が完了しました。</Typography>
        <Typography>続いてアプリのインストールを行いましょう。</Typography>
        <Typography>
          <Link href="https://mattermost.com/apps/" target="_blank" rel="noopener noreferrer">
            アプリの取得はこちらから
          </Link>
        </Typography>
        <Typography>
          アプリ起動後、以下のように設定し、先ほど作成したアカウントでログインしてください。
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 300 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>サーバーURL</strong>
                </TableCell>
                <TableCell>mm.digicre.net</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>サーバー名</strong>
                </TableCell>
                <TableCell>デジクリ</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialMattermostAppPage;
