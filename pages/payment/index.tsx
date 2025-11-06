import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Heading from "../../components/Common/Heading";

import { usePayments } from "../../hook/payment/usePayments";
import { Payment } from "../../interfaces/payment";
const modalStyle = {
  position: "absolute" as const,
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
  const [payments, updatePayments] = usePayments();
  const [targetPayment, updateTargetPayment] = useState<Payment>();

  return (
    <>
      <Grid>
        <Heading level={1}>支払い一覧</Heading>
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
                    {payment.checked ? (
                      <span style={{ color: "green" }}>済</span>
                    ) : (
                      <span style={{ color: "red" }}>未</span>
                    )}
                  </TableCell>
                  <TableCell>{payment.note}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        updateTargetPayment(payment);
                      }}
                    >
                      詳細
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={targetPayment !== undefined}
          onClose={() => {
            updateTargetPayment(undefined);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              支払い詳細
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              支払い番号: {targetPayment?.paymentId}
              <br />
              学籍番号: {targetPayment?.studentNumber}
              <br />
              支払い名義: {targetPayment?.transferName}
              <br />
              確認:{" "}
              <Checkbox
                checked={targetPayment?.checked}
                onChange={() => {
                  updateTargetPayment({ ...targetPayment, checked: !targetPayment?.checked });
                }}
              ></Checkbox>
              <br />
              備考:{" "}
              <TextField
                fullWidth
                value={targetPayment?.note}
                onChange={(e) => {
                  updateTargetPayment({ ...targetPayment, note: e.target.value });
                }}
              />
              <br />
              <Button
                onClick={() => {
                  updatePayments(
                    targetPayment.paymentId,
                    targetPayment.checked,
                    targetPayment.note,
                  );
                  updateTargetPayment(undefined);
                }}
                variant="contained"
              >
                保存
              </Button>
            </Typography>
          </Box>
        </Modal>
      </Grid>
    </>
  );
};

export default PaymentPage;
