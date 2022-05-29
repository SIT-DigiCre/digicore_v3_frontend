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
  Modal,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Link from "next/link";
import { ChangeEventHandler, useState } from "react";
import { useAuthState } from "../../../hook/useAuthState";
import { usePaymentState } from "../../../hook/usePaymentState";
const PaymentPage = () => {
  const { authState } = useAuthState();
  const [resultState, setResultState] = useState<Boolean>();
  const [openHistory, setOpenHistory] = useState(false);
  const { isLoading, latestPayment, paymentHistory, setLatestPayment, updateLatestPayment } =
    usePaymentState();
  if (authState.isLoading || !authState.isLogined || isLoading) return <p>Loading...</p>;
  const onChangeTransferName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLatestPayment({ ...latestPayment, transfer_name: e.target.value });
  };
  const onClickSubmit = async () => {
    const result = await updateLatestPayment();
    setResultState(result);
  };
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <>
      <Container>
        <Grid>
          <h2>部費振り込み完了報告フォーム</h2>
          <Typography>
            振り込みは済みましたか？振込先は <Link href="user/joined">こちら</Link>
            のページをご覧下さい。
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOpenHistory(true);
            }}
          >
            過去の記録を見る
          </Button>
          <Modal
            open={openHistory}
            onClose={() => {
              setOpenHistory(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <h3>記録</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>年度</TableCell>
                      <TableCell align="right">会計確認</TableCell>
                      <TableCell align="right">最終更新</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow
                        key={payment.year}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {payment.year}
                        </TableCell>
                        <TableCell align="right">{payment.checked ? "確認" : "未確認"}</TableCell>
                        <TableCell align="right">
                          {new Date(payment.updated_at).toLocaleDateString("ja")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Modal>
        </Grid>
        {resultState === undefined ? (
          <Grid>
            <h3>{latestPayment.year}年度用</h3>
            <FormControl margin="normal">
              <InputLabel htmlFor="name">振込名義</InputLabel>
              <Input
                id="name"
                aria-describedby="name-helper-text"
                onChange={onChangeTransferName}
                value={latestPayment.transfer_name}
                required
              />
              <FormHelperText id="name-helper-text">
                ATMにて入力した振込名義（カタカナ）を記入してください
              </FormHelperText>
            </FormControl>
            <Alert severity="warning">振込を終えた状態でこのフォームに回答してください</Alert>
            <Button variant="contained" onClick={onClickSubmit}>
              上記事項を確認し振込情報を更新する
            </Button>
          </Grid>
        ) : (
          <Grid>
            {resultState ? (
              <Typography margin="normal">
                フォームの登録が完了しました。<Link href="/">ホームに戻る</Link>
              </Typography>
            ) : (
              <Typography margin="normal">
                おっと、フォームの登録に失敗しました！リロードしてやり直してみてください
              </Typography>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default PaymentPage;
