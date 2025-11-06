import { useRouter } from "next/router";
import { useState } from "react";

import { Button, Grid, Typography } from "@mui/material";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Heading from "../../../components/Common/Heading";
import PageHead from "../../../components/Common/PageHead";
import { PrivateParentProfileEditor } from "../../../components/Profile/PrivateParentProfileEditor";
import { PrivatePersonalProfileEditor } from "../../../components/Profile/PrivatePersonalProfileEditor";
import TransferAccountView from "../../../components/Register/TransferAccountView";
import { useActiveLimit } from "../../../hook/profile/useActiveLimit";
import { useAuthState } from "../../../hook/useAuthState";
import { getFiscalYear } from "../../../utils/date-util";

const checkStatus = (activeLimit: string): "未確認" | "部費入金待ち" | "部費入金済み" => {
  const now = new Date();
  const limit = new Date(activeLimit);
  if (getFiscalYear(now) < getFiscalYear(limit)) return "部費入金済み";
  if (limit.getMonth() > 4) return "部費入金待ち";
  return "未確認";
};

const ContinuePage = () => {
  const [check, setCheck] = useState(false);
  const [activeLimit, setActiveLimit] = useActiveLimit();
  const { authState } = useAuthState();
  const router = useRouter();

  if (!authState.isLogined) return <p>未ログイン状態です。ログインしてください。</p>;

  return (
    <>
      <PageHead title="継続確認フォーム" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "継続確認フォーム" }]} />
      <Grid sx={{ mt: 2 }}>
        <Heading level={2}>継続確認フォーム</Heading>
        <Typography>
          既存でデジクリ部員の方が継続をするフォームです。
          <br />
          学籍番号に変更がある場合は、こちらのフォームを使用せずインフラサポート・依頼フォームからご相談ください。
        </Typography>
        <a href="https://forms.gle/MQicA1No8LSZPe5QA" target="_blank">
          インフラサポート・依頼フォーム
        </a>
      </Grid>
      <Grid sx={{ mt: 2 }}>
        <Typography>
          現在のアカウントの有効期限: {new Date(activeLimit).toLocaleDateString()}
        </Typography>
        <Typography>
          判定: <Status activeLimit={activeLimit} />
        </Typography>
      </Grid>
      {checkStatus(activeLimit) === "未確認" ? (
        <Grid sx={{ mt: 2 }}>
          {check ? (
            <>
              <Heading level={3}>緊急連絡先の再確認</Heading>
              <Typography>
                緊急連絡先に変更がないかを再確認してください。変更がある場合は、修正を加え保存ボタンを押してください。
              </Typography>
              <hr />
              <Grid sx={{ mt: 2, mb: 1 }}>
                <Heading level={4}>自身の連絡先</Heading>
                <PrivatePersonalProfileEditor />
              </Grid>
              <hr />
              <Grid sx={{ mt: 2, mb: 1 }}>
                <Heading level={4}>保護者の連絡先</Heading>
                <PrivateParentProfileEditor />
              </Grid>
              <hr />
              <Grid sx={{ mt: 2 }}>
                <Typography>上記緊急連絡先に間違いはありませんか？</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveLimit().then((res) => {
                      if (res) {
                        alert("継続処理が完了しました。部費の振込をお願いします。");
                        router.reload();
                      } else {
                        alert("継続処理に失敗しました。");
                      }
                    });
                  }}
                >
                  間違い無く、これで継続する
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  setCheck(true);
                }}
              >
                継続の意思がある（継続処理に進む）
              </Button>
            </>
          )}
        </Grid>
      ) : (
        <>
          {checkStatus(activeLimit) === "部費入金待ち" ? (
            <TransferAccountView />
          ) : (
            <Typography>継続処理は完了しています。今年度もデジクリしていきましょう！</Typography>
          )}
        </>
      )}
    </>
  );
};

const Status = ({ activeLimit }: { activeLimit: string }) => {
  const st = checkStatus(activeLimit);
  switch (st) {
    case "未確認":
      return <span style={{ color: "red" }}>継続意思未確認</span>;
    case "部費入金待ち":
      return <span style={{ color: "orange" }}>部費入金待ち</span>;
    case "部費入金済み":
      return <span style={{ color: "green" }}>継続処理完了</span>;
  }
};

export default ContinuePage;
