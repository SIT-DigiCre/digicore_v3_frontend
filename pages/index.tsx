import { Container } from "@mui/material";

const IndexPage = () => {
  return (
    <Container>
      <h1>ようこそ、デジコア3.0へ</h1>
      <p>デジコア3.0は開発途上のアプリケーションです。優しい気持ちで接してみてください</p>
      <iframe
        src="https://calendar.google.com/calendar/embed?src=sitdigicrecircle%40gmail.com&ctz=Asia%2FTokyo"
        style={{ border: 0 }}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </Container>
  );
};

export default IndexPage;
