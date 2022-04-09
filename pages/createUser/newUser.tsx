import { Grid, Button, Container } from "@mui/material";

const newUserPage = () => {
  return (
    <>
      <Container>
        <Grid>
          <h1>仮入部申請フォーム</h1>
          <form>
            <h3>名前</h3>
            <input></input>
            <h3>興味のある班</h3>
            <input></input>
            <h3>興味のある入門講座</h3>
            <input></input>
          </form>
        </Grid>
      </Container>
    </>
  );
  // 先に既存生用のアカウント作成フォームを用意する。
  // Googleログインで登録済みのアカウントをさらに編集できるようにしたい。
};

export default newUserPage;
