import { Stack, Typography } from "@mui/material";

import { ButtonLink } from "../components/Common/ButtonLink";
import Heading from "../components/Common/Heading";
import PageHead from "../components/Common/PageHead";

const NotFoundPage = () => {
  return (
    <>
      <PageHead title="ページが見つかりません" />
      <Stack alignItems="start">
        <Heading level={2}>404</Heading>
        <Typography>
          お探しのページは見つかりませんでした。削除されたか、移動した可能性があります。
          この画面が表示されることが意図しない結果である場合は、デジコアの開発チームまでご連絡ください。
        </Typography>
        <Stack alignItems="flex-end" mt={2} width="100%">
          <ButtonLink variant="contained" href="/">
            ホームへ戻る
          </ButtonLink>
        </Stack>
      </Stack>
    </>
  );
};

export default NotFoundPage;
