import { useState } from "react";

import { CheckCircle, CopyAll, CurrencyYen, MeetingRoom, ReceiptLong } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import HomeLinkCard from "@/components/Home/HomeLinkCard";

const IndexPage = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyServerUrl = () => {
    navigator.clipboard.writeText("mm.digicre.net");
    setIsCopied(true);
  };

  return (
    <>
      <PageHead title="ホーム" />
      <Stack spacing={2}>
        <Heading level={2}>ようこそ、デジコア3へ</Heading>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid size={{ md: 6, xs: 12 }} sx={{ alignItems: "stretch", display: "flex" }}>
            <HomeLinkCard
              title="Mattermostへの接続"
              action={
                <Button
                  variant="contained"
                  onClick={handleCopyServerUrl}
                  startIcon={isCopied ? <CheckCircle /> : <CopyAll />}
                >
                  サーバーURLをコピー
                </Button>
              }
            >
              <Typography>
                アプリは{" "}
                <Link href="https://mattermost.com/apps/" target="_blank" rel="noopener noreferrer">
                  公式ダウンロードページ
                </Link>{" "}
                から取得できます。
              </Typography>
              <Typography>
                ログイン時のサーバーURLは{" "}
                <Link href="https://mm.digicre.net" target="_blank" rel="noopener noreferrer">
                  mm.digicre.net
                </Link>
                、サーバー名は「デジクリ」です。
              </Typography>
            </HomeLinkCard>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ alignItems: "stretch", display: "flex" }}>
            <HomeLinkCard
              title="入退室管理"
              action={
                <ButtonLink
                  href="/activity/omiya-bushitsu"
                  variant="contained"
                  startIcon={<MeetingRoom />}
                >
                  部室のようすを見る
                </ButtonLink>
              }
            >
              <Typography>
                部室への入退室を記録できます。今誰が部室にいるのかも確認することができます。
              </Typography>
            </HomeLinkCard>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ alignItems: "stretch", display: "flex" }}>
            <HomeLinkCard
              title="部費振込報告"
              action={
                <ButtonLink
                  href="/user/form/payment"
                  variant="contained"
                  startIcon={<CurrencyYen />}
                >
                  振込を報告する
                </ButtonLink>
              }
            >
              <Typography>部員の情報を一覧から探すことができます。</Typography>
            </HomeLinkCard>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }} sx={{ alignItems: "stretch", display: "flex" }}>
            <HomeLinkCard
              title="稟議"
              action={
                <ButtonLink href="/budget" variant="contained" startIcon={<ReceiptLong />}>
                  稟議を見る
                </ButtonLink>
              }
            >
              <Typography>予算に関する申請や承認状況を確認できます。</Typography>
            </HomeLinkCard>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default IndexPage;
