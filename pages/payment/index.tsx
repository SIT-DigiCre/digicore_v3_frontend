import { Box, Button, Checkbox, Container, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { usePayments } from "../../hook/payment/usePayments";
import { useDarkMode } from "../../hook/useDarkMode";
import { DarkMode } from "../../interfaces";
import { Payment } from "../../interfaces/payment";

const PaymentPage = () => {
  const [payments, updatePayments] = usePayments();
  const [targetPayment, updateTargetPayment] = useState<Payment>();

  return (
    <Container>
      <Grid>
        <h1>支払い一覧</h1>
        <hr />
      </Grid>
      <Grid container>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>学籍番号</TableCell>
                <TableCell>支払い名義</TableCell>
                <TableCell>確認</TableCell>
                <TableCell>備考</TableCell>
                <TableCell>詳細</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell>{payment.studentNumber}</TableCell>
                  <TableCell>{payment.transferName}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={payment.checked}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>{payment.note}</TableCell>
                  <TableCell>
                    <Button onClick={() => { updateTargetPayment(payment) }}>詳細</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={targetPayment !== undefined}
          onClose={() => { updateTargetPayment(undefined) }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="payment-modal">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              支払い詳細
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              支払い番号: {targetPayment?.paymentId}<br />
              学籍番号: {targetPayment?.studentNumber}<br />
              支払い名義: {targetPayment?.transferName}<br />
              確認: <Checkbox
                checked={targetPayment?.checked}
                onChange={() => { updateTargetPayment({ ...targetPayment, checked: !targetPayment?.checked }) }}
              ></Checkbox>
              <br />
              備考: <TextField fullWidth value={targetPayment?.note} onChange={(e) => { updateTargetPayment({ ...targetPayment, note: e.target.value }) }}
              />
              <br />
              <Button onClick={() => { updatePayments(targetPayment.paymentId, targetPayment.checked, targetPayment.note); updateTargetPayment(undefined) }}>保存</Button>
            </Typography>
          </Box>
        </Modal>
      </Grid>
    </Container>
  );
};

export default PaymentPage;
