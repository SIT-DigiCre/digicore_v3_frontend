import { Grid, Button, Container } from "@mui/material";

const createUserPage = () => {
  return (
    <>
      <Container>
        <Grid>
          <h1>既存部員用のデジコアv3登録フォーム</h1>
          <p>突貫工事で作ったからデザインは許して</p>
          <form>
            <h3>ユーザー名</h3>
            <input></input>
            <h3>学籍番号</h3> {/* Googleアカウントから確保できる */}
            <input></input>
            <h3>学年</h3>
            <input></input>
            <h3>アイコンのURL</h3> {/* これで実装するわけない、流石にアイコンを投稿させます */}
            <input></input>
            <h3>ひとこと</h3> {/* shortSelfIntroduction */}
            <input></input>
          </form>
        </Grid>
      </Container>
    </>
  );
  // 先に既存生用のアカウント作成フォームを用意する。
  // Googleログインで登録済みのアカウントをさらに編集できるようにしたい。
};

export default createUserPage;
