import Link from "next/link";

import { Box, Stack, Typography } from "@mui/material";

import Heading from "../components/Common/Heading";
import PageHead from "../components/Common/PageHead";

const IndexPage = () => {
  return (
    <>
      <PageHead title="ホーム" />
      <Stack spacing={2}>
        <Box>
          <Heading level={2}>ようこそ、デジコア3.1へ</Heading>
          <Typography>
            デジコア3.1は開発途上のアプリケーションです。優しい気持ちで接してみてください
          </Typography>
        </Box>
        <Box>
          <Heading level={2}>使いそうな項目</Heading>
          <Typography>
            <Link href="/register/joined">入部完了ページ</Link>
            ：部費の入金先やMattermost、Discordへの参加リンクがあります
          </Typography>
        </Box>
        <div className="index_calender">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=sitdigicrecircle%40gmail.com&ctz=Asia%2FTokyo"
            style={{ border: 0 }}
            width="800"
            height="600"
          ></iframe>
        </div>
      </Stack>
    </>
  );
};

export default IndexPage;
