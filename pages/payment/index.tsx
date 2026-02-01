import type { GetServerSideProps } from "next";
import { useState } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import PaymentDetailDialog from "../../components/Payment/PaymentDetailDialog";
import { Payment } from "../../interfaces/payment";
import { createServerApiClient } from "../../utils/fetch/client";

type Props = {
  payments: Payment[];
};

const PaymentPage = ({ payments }: Props) => {
  const [targetPayment, setTargetPayment] = useState<Payment | null>(null);

  return (
    <>
      <PageHead title="支払い一覧" />
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
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
                  <Button onClick={() => setTargetPayment(payment)}>詳細</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {targetPayment && (
        <PaymentDetailDialog
          payment={targetPayment}
          open={!!targetPayment}
          onClose={() => setTargetPayment(null)}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const client = createServerApiClient(req);
  try {
    const res = await client.GET("/payment");
    const payments = res.data?.payments ?? [];
    return { props: { payments } };
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return { props: { payments: [] } };
  }
};

export default PaymentPage;
