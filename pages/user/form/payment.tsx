import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "../../../components/Common/PageHead";
import { usePayment } from "../../../hook/user/usePayment";
import { PaymentHistory } from "../../../interfaces/form";
import { getFiscalYear } from "../../../utils/date-util";

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

const PaymentPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { paymentHistories, updatePayment } = usePayment();
  const [transferName, setTransferName] = useState("");
  const getCurrentYearPayment = (histories: PaymentHistory[]) => {
    return histories.find((h) => h.year === getFiscalYear(new Date()));
  };
  useEffect(() => {
    if (paymentHistories.length === 0) return;
    const current = getCurrentYearPayment(paymentHistories);
    if (current) setTransferName(current.transferName);
  }, [paymentHistories]);
  const onSubmit = () => {
    updatePayment(transferName).then((result) => {
      setOpenModal(false);
      setTransferName("");
    });
  };
  return (
    <>
      <PageHead title="部費振込報告" />
      <Container>
        <Grid>
          <h2>部費振り込み完了報告フォーム</h2>
          <Typography>
            振り込みは済みましたか？振込先は <Link href="/user/joined">こちら</Link>
            のページをご覧下さい。
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            今年度分の{getCurrentYearPayment(paymentHistories) ? "報告修正" : "報告"}をする
          </Button>
          <Modal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <h3>{getFiscalYear(new Date())}年度用</h3>
              <FormControl margin="normal">
                <InputLabel htmlFor="name">振込名義</InputLabel>
                <Input
                  id="name"
                  aria-describedby="name-helper-text"
                  onChange={(e) => {
                    setTransferName(e.target.value);
                  }}
                  value={transferName}
                  required
                />
                <FormHelperText id="name-helper-text">
                  ATMにて入力した振込名義（カタカナ）を記入してください
                </FormHelperText>
              </FormControl>
              <Alert severity="warning">振込を終えた状態でこのフォームに回答してください</Alert>
              <Button variant="contained" onClick={onSubmit}>
                上記事項を確認し振込情報を更新する
              </Button>
            </Box>
          </Modal>
        </Grid>
        <Grid>
          <h3>記録</h3>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>年度</TableCell>
                  <TableCell>名義</TableCell>
                  <TableCell align="right">会計確認</TableCell>
                  <TableCell align="right">最終更新</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistories.map((payment) => (
                  <TableRow
                    key={payment.year}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {payment.year}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {payment.transferName}
                    </TableCell>
                    <TableCell align="right">{payment.checked ? "確認" : "未確認"}</TableCell>
                    <TableCell align="right">
                      {new Date(payment.updatedAt).toLocaleDateString("ja")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </>
  );
};

export default PaymentPage;
