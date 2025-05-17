import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  Button,
  Container,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  colors,
} from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { useAuthState } from "../../hook/useAuthState";
import { MattermostDisplayPage } from "../../interfaces/mattermost";
import { User } from "../../interfaces/user";


type Props = {
  displayPageSetter: (page: MattermostDisplayPage) => void;
};

export const MattermostAgreement = ({ displayPageSetter }: Props) => {
  const [agree, setAgree] = useState(false);
  const { authState } = useAuthState();
  const userProfile = authState.user;
  const router = useRouter();
  const checkProfile = (userProfile: User): string | boolean => {
    if (userProfile.iconUrl.length === 0) {
      return "アイコンが設定されていません。";
    } else if (userProfile.studentNumber === userProfile.username) {
      return "ユーザ名が学籍番号になっています。";
    } else {
      return true;
    }
  };
  return (
    <Container>
      <PageHead title="Mattermost 移行用特設ページ" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Mattermost" }]} />
      <Grid margin={2}>
        <Typography variant="h4" align="center" noWrap={true}>
          Mattermost
        </Typography>
        <Typography variant="h4" align="center" noWrap={true}>
          移行用特設ページ
        </Typography>
      </Grid>
      <Grid margin={2}>
        <Typography align="center">
          2022/10/17 より デジクリ は Slack から Mattermost へ移行を開始いたします。
        </Typography>
        <Typography align="center">
          これから部員の皆さんにはアカウントを登録していただきますが、
        </Typography>
        <Typography align="center" sx={{ color: colors.red[500] }}>
          アカウントを登録する前に以下のお願い事をよくお読みください。
        </Typography>
      </Grid>
      <hr />
      <Grid margin={2}>
        <Typography variant="h5">Mattermostとは</Typography>
        <Typography my={4} align="center">
          <Image alt="Mattermost" src="/image/mattermost_logo.png" width="300" height="50" objectFit="contain" />
        </Typography>
        <Typography>
          Mattermost は
          組織や企業の内部チャットとして設計された、オープンソースのチャットサービスです。
        </Typography>
        <Typography>
          Slack や Microsoft Teams の代替ソフトとして 売り出されており、
          <ul>
            <li>チャンネルの閲覧、作成</li>
            <li>部内メンバーとのDM</li>
            <li>画像やスライドの投稿</li>
            <li>テキストでの連絡・絵文字リアクション</li>
          </ul>
          など、今まで デジクリ Slack で行えた 大概のことは、デジクリ{" "}
          <a href="https://mattermost.com/" target="_blank" rel="noreferrer">
            Mattermost
          </a>{" "}
          でもできると考えて良いです。
        </Typography>
        <Typography variant="h6">登録後にやること</Typography>
        <Typography>
          サーバーへの加入後、皆さんは自動的に ~town-square チャンネルに参加します。
        </Typography>
        <Typography>
          Slack の #general と同様、 デジクリに関する重要な連絡は ~town-square
          上でお知らせしますが、 その他にも以下のチャンネルへ参加することを 強くオススメします。
        </Typography>
        <Typography>
          <ul>
            <li>~random</li>
            <li>~presentation</li>
          </ul>
        </Typography>
        <Typography>
          ~random では部員なら誰でもデジクリ内外の イベントや企画の案内・宣伝、 ~presentation
          では部員の発表資料の投稿ができます。
        </Typography>
        <Typography>
          <Image alt="Mattermostのスクリーンショット" src="/image/mattermost_screen.png" width={300} height={250} objectFit="contain" />
        </Typography>
        <Typography>
          チャンネルへの参加は、 左上の＋ボタン（モバイル版は左上のメニュー）から行えます。
        </Typography>
        <Typography>
          Mattermost 登録後にすべきオススメの設定を、
          <a
            href="https://teal-consonant-36c.notion.site/Mattermost-89604847155a4a92aaaa46d51cac65c2"
            target="_blank"
            rel="noreferrer"
          >
            デジクリMattermostマニュアル
          </a>{" "}
          に記載しました。
        </Typography>
        <Typography>
          プロフィール写真の設定や、 チャンネル入退出の通知についてなど、
          興味がありましたら是非ご一読ください。
        </Typography>
        <hr />
        <Typography m={2} sx={{ fontSize: "2rem" }}>
          さあ、登録を始めましょう
        </Typography>
        <Typography>
          上記の説明をご確認いただけましたら、
          下のボタンを押してデジクリMattermostへの登録を始めてください。
        </Typography>
        <Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                  }}
                />
              }
              label="上記の説明をよく読みました"
            />
          </FormGroup>
        </Typography>
        <Typography align="center">
          <Button
            variant="contained"
            disabled={!agree}
            onClick={() => {
              const profileWarning = checkProfile(userProfile);
              if (
                profileWarning !== true &&
                confirm(profileWarning + "プロフィール編集画面に移動しますか？")
              ) {
                //window.open("/user/profile", "_blank");
                router.push(`/user/profile?backto=/mattermost`);
              } else {
                displayPageSetter("register");
              }
            }}
          >
            Mattermost への登録を開始
          </Button>
        </Typography>
      </Grid>
    </Container>
  );
};
