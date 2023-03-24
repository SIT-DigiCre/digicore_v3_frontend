import { Checkbox, Container, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { usePayments } from "../../hook/payment/usePayments";
import { useDarkMode } from "../../hook/useDarkMode";
import { DarkMode } from "../../interfaces";

const PaymentPage = () => {
  const [payments, updatePayment] = usePayments();

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
                <TableCell>支払いID</TableCell>
                <TableCell>学籍番号</TableCell>
                <TableCell>支払い名義</TableCell>
                <TableCell>確認</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell>{payment.paymentId}</TableCell>
                  <TableCell>{payment.studentNumber}</TableCell>
                  <TableCell>{payment.transferName}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={payment.checked}
                      onChange={() => { updatePayment(payment.paymentId, !payment.checked) }}
                    ></Checkbox>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
};

export default PaymentPage;
