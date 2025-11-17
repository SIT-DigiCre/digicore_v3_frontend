import { Container, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import TransferClubFeeView from "../../components/Register/TransferClubFeeView";
import { useAuthState } from "../../hook/useAuthState";

const ContinuedPage = () => {
  const { authState } = useAuthState();
  if (authState.isLoading) return <p>読み込み中...</p>;

  return (
    <>
      <PageHead title="継続完了" />
      <Container>
        <Heading level={2}>継続処理完了</Heading>
        <Typography>これで継続処理は完了です。</Typography>
        <TransferClubFeeView />
      </Container>
    </>
  );
};

export default ContinuedPage;
