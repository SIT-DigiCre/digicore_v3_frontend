import Link from "next/link";
import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { useAuthState } from "../../hook/useAuthState";

const ContinuedPage = () => {
  const { authState } = useAuthState();
  const router = useRouter();
  if (authState.isLoading) return <p>読み込み中...</p>;
  if (!authState.isLogined) router.push("/login");

  return (
    <>
      <PageHead title="継続完了" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Continued" }]} />
      <Grid>
        <h2>継続処理完了</h2>
        <Typography>これで継続処理は完了です。</Typography>
      </Grid>
      <Grid>
        <h3>部費の振込について</h3>
        <Typography>
          手数料抜きで2000円の部費を<b>3週間以内</b>
          に、下記の口座に振り込んでください。デジクリの口座はゆうちょ銀行です。
        </Typography>
        <Typography>
          部費の振込が完了した際はデジコア上の
          <Link href="/user/form/payment">部費振込報告フォーム</Link>
          から振込完了報告をする必要があります
        </Typography>
        <Typography>
          期限を過ぎても振込完了報告がされない場合、メールにて会計から確認の連絡が届きます。それらに反応が無い場合、デジコアやSlack、Discordのアカウント制限がかかります。
        </Typography>
        <Grid style={{ padding: "2px", border: "solid" }}>
          <Typography>記号:10370 番号:81757581 店番:038</Typography>
          <Typography>口座番号:8175758 預金種目:普通預金</Typography>
        </Grid>
        <Grid>
          <h4>振込方法と手数料</h4>
          <Grid style={{ marginLeft: "30px" }}>
            <ol>
              <li>
                ゆうちょ銀行の口座から振り込む場合
                <br />
                <br />
                <Typography>「電信振替」にて入金されることをお勧めいたします。</Typography>
                <Typography>ATM扱い:100円 窓口扱い:146円</Typography>
                <Typography>ゆうちょダイレクト:月5回まで無料、6回目以降100円</Typography>
                <a
                  href="https://www.jp-bank.japanpost.jp/kojin/sokin/koza/kj_sk_kz_furikae.html"
                  target="_blank"
                >
                  ゆうちょ銀行HP「電信振替」について
                </a>
              </li>
              <li>
                他銀行の口座から振り込む場合
                <br />
                <br />
                <Typography>
                  各銀行の窓口やATMからなど、それぞれの方法で入金してください。手数料は各銀行・各方法によって異なります。
                </Typography>
              </li>
              <li>
                現金で振り込む場合
                <br />
                <br />
                <Typography>お近くの銀行のATMや、窓口から振り込んでください。</Typography>
                <Typography>
                  手数料はおよそ440～660円ほどですが、各方法によって異なります。郵便局窓口からの「電信払込み」ですと、550円です。
                </Typography>
                <Typography>
                  また、デジクリの口座は総合口座ですので、ゆうちょ・郵便局での「通常払込み」はできません。
                </Typography>
                <a
                  href="https://www.jp-bank.japanpost.jp/kojin/sokin/koza/kj_sk_kz_densin.html"
                  target="_blank"
                >
                  ゆうちょ銀行HP「電信払込み」について
                </a>
              </li>
            </ol>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ContinuedPage;
