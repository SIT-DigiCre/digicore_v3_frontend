import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useState } from "react";

import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ButtonLink } from "../../../components/Common/ButtonLink";
import PageHead from "../../../components/Common/PageHead";
import PaymentDetailDialog from "../../../components/Payment/PaymentDetailDialog";
import { Payment } from "../../../interfaces/payment";
import { createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const paymentsRes = await client.GET("/payment");

    if (!paymentsRes.data || !paymentsRes.data.payments) {
      return { props: { payments: [] } };
    }

    return { props: { payments: paymentsRes.data.payments } };
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return { props: { payments: [] } };
  }
};

const AdminPaymentPage = ({ payments }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [targetPayment, updateTargetPayment] = useState<Payment | null>(null);

  return (
    <>
      <PageHead title="[管理者用] 部費振込一覧" />

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin" startIcon={<ArrowBack />} variant="text">
            管理者用ポータルに戻る
          </ButtonLink>
        </Stack>
        {payments && payments.length > 0 ? (
          <TableContainer>
            <Table>
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
                        <Chip label="確認済" color="success" />
                      ) : (
                        <Chip label="未確認" color="error" />
                      )}
                    </TableCell>
                    <TableCell>{payment.note}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          updateTargetPayment(payment);
                        }}
                        aria-label={`${payment.studentNumber}の詳細を表示`}
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography my={2}>部費振込情報がありません</Typography>
        )}
      </Stack>
      {targetPayment && (
        <PaymentDetailDialog
          payment={targetPayment}
          open={!!targetPayment}
          onClose={() => {
            updateTargetPayment(null);
          }}
        />
      )}
    </>
  );
};

export default AdminPaymentPage;
