import { Container, Link, Typography } from "@mui/material";

const IndexPage = () => {
  return (
    <Container>
      <Typography sx={{ m: 5 }} variant="h2">
        デジコア v3.0 へようこそ。
      </Typography>
      <Typography sx={{ m: 5 }} variant="body1">
        新規登録（入部）は
        <Link href="register">こちら</Link>
        で行えます。
      </Typography>
    </Container>
  );
};

export default IndexPage;
