import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Typography,
  Input,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useAuthState } from "../../../hook/useAuthState";
import { usePaymentState } from "../../../hook/usePaymentState";
const PaymentPage = () => {
  const { authState } = useAuthState();
  const { isLoading, payment, setPayment, updatePayment } = usePaymentState();
  if (authState.isLoading || !authState.isLogined || isLoading) return <p>Loading...</p>;
  return (
    <>
      <Container>
        <Grid>
          <h2>部費振り込み完了報告フォーム</h2>
          <Typography>
            振り込みは済みましたか？振込先は <Link href="user/joined">こちら</Link>
            のページをご覧下さい。
          </Typography>
        </Grid>
        <Grid>
          <FormControl>
            <InputLabel htmlFor="name">振込名義</InputLabel>
            <Input id="name" aria-describedby="name-helper-text" />
            <FormHelperText id="name-helper-text">
              ATMにて入力した振込名義（カタカナ）を記入してください
            </FormHelperText>
          </FormControl>
          <Alert severity="warning">振込を終えた状態でこのフォームに回答してください</Alert>
          <Button variant="outlined">上記事項を確認し振込情報を更新する</Button>
        </Grid>
      </Container>
    </>
  );
};

export default PaymentPage;
