import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useState } from "react";

import {
  AccountCircle,
  CheckCircle,
  CopyAll,
  CurrencyYen,
  MeetingRoom,
  ReceiptLong,
  School as SchoolIcon,
} from "@mui/icons-material";
import { Avatar, Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import HomeLinkCard from "@/components/Home/HomeLinkCard";
import { createServerApiClient } from "@/utils/fetch/client";

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const profileRes = await client.GET("/user/me");

    if (profileRes.error || profileRes.data === undefined) {
      console.error("ユーザープロフィールの取得に失敗しました:", profileRes.error);
      return {
        props: {
          profile: null,
        },
      };
    }

    return {
      props: {
        profile: profileRes.data,
      },
    };
  } catch (error) {
    console.error("ユーザープロフィールの取得に失敗しました:", error);
    return {
      props: {
        profile: null,
      },
    };
  }
};

const IndexPage = ({ profile }: PageProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyServerUrl = async () => {
    // クリップボード API 対応チェック
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      alert(
        "このブラウザではクリップボードへのコピー機能がサポートされていません。URL を手動でコピーしてください。",
      );
      return;
    }
    try {
      await navigator.clipboard.writeText("mm.digicre.net");
      setIsCopied(true);
    } catch (error) {
      // ログ出力しておくとデバッグしやすくなります
      console.error("クリップボードへのコピーに失敗しました:", error);
      alert("クリップボードへのコピーに失敗しました。URL を手動でコピーしてください。");
    }
  };

  return (
    <>
      <PageHead title="ホーム" />
      <Stack spacing={2}>
        <Heading level={2}>ようこそ、デジコア3へ</Heading>
        {profile && (
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              p: 2,
              width: "100%",
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ sm: 4, xs: 12 }}>
                <Box display="flex" justifyContent="center">
                  <Avatar
                    src={profile.iconUrl}
                    alt={`${profile.username}のアイコン`}
                    sx={{
                      border: 3,
                      borderColor: "primary.main",
                      height: { sm: 150, xs: 120 },
                      width: { sm: 150, xs: 120 },
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ sm: 6, xs: 12 }}>
                <Box textAlign={{ sm: "left", xs: "center" }}>
                  <Heading level={2}>{profile.username}</Heading>

                  {profile.shortIntroduction && (
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      {profile.shortIntroduction}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent={{ sm: "flex-start", xs: "center" }}>
                    <Chip
                      icon={<SchoolIcon />}
                      label={`${profile.schoolGrade}年生`}
                      color="primary"
                      variant="outlined"
                      size="medium"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "medium",
                        px: 1,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Stack sx={{ alignItems: "flex-end", mt: 2 }}>
              <ButtonLink
                href={`/member/${profile.userId}`}
                variant="contained"
                startIcon={<AccountCircle />}
              >
                プロフィールを見る
              </ButtonLink>
            </Stack>
          </Card>
        )}
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
              title="プロフィール"
              action={
                <ButtonLink href="/user/profile" variant="contained" startIcon={<AccountCircle />}>
                  プロフィールを編集する
                </ButtonLink>
              }
            >
              <Typography>
                公開プロフィールや自己紹介、連絡先などの情報を確認・編集できます。
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
              <Typography>
                部費の振り込みが済んだらこのページから報告をしてください。振込先口座もここから確認できます。
              </Typography>
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
