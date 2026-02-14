import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import ProfileConfirmDialog from "@/components/Payment/ProfileConfirmDialog";
import TransferNameDialog from "@/components/Payment/TransferNameDialog";
import TransferClubFeeView from "@/components/Register/TransferClubFeeView";
import { useAuthState } from "@/hook/useAuthState";
import { getFiscalYear } from "@/utils/date-util";
import { apiClient, createServerApiClient } from "@/utils/fetch/client";

import type { PaymentHistory } from "@/interfaces/form";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const res = await client.GET("/user/me/payment");

    if (!res.data?.histories) {
      return { props: { initialPaymentHistories: [] as PaymentHistory[] } };
    }

    return { props: { initialPaymentHistories: res.data.histories } };
  } catch (error) {
    console.error("Failed to fetch payment histories:", error);
    return { props: { initialPaymentHistories: [] as PaymentHistory[] } };
  }
};

type PaymentPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PaymentPage = ({ initialPaymentHistories }: PaymentPageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const currentYear = getFiscalYear(new Date());
  const currentYearPayment = initialPaymentHistories.find((h) => h.year === currentYear);

  const handleSubmit = async (transferName: string) => {
    if (!authState.isLogined || !authState.token) {
      setNewError({
        message: "ログインが必要です",
        name: "payment-update-fail",
      });
      return;
    }

    const response = await apiClient.PUT("/user/me/payment", {
      body: { transferName },
      headers: { Authorization: `Bearer ${authState.token}` },
    });

    if (response.error) {
      setNewError({
        message: response.error.message || "振込情報の更新に失敗しました",
        name: "payment-update-fail",
      });
      return;
    }

    removeError("payment-update-fail");
    setOpenTransferDialog(false);
    setOpenConfirmDialog(true);
    await router.push(router.asPath);
  };

  const getStatusChip = (payment: PaymentHistory) => {
    if (payment.checked) {
      return <Chip label="確認済み" color="success" size="small" />;
    }
    return <Chip label="確認待ち" color="warning" size="small" />;
  };

  return (
    <>
      <PageHead title="部費振込" />
      <Heading level={2}>振込完了報告</Heading>
      <Stack spacing={4}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="subtitle1">{currentYear}年度のステータス</Typography>
            {currentYearPayment ? (
              getStatusChip(currentYearPayment)
            ) : (
              <Chip label="未報告" color="default" size="small" />
            )}
            <Button variant="contained" onClick={() => setOpenTransferDialog(true)}>
              {currentYearPayment ? "報告を修正する" : "振込報告をする"}
            </Button>
          </Stack>
        </Paper>

        <Box>
          <Heading level={2}>振込記録</Heading>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow>
                  <TableCell>年度</TableCell>
                  <TableCell>名義</TableCell>
                  <TableCell align="right">会計確認</TableCell>
                  <TableCell align="right">最終更新</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {initialPaymentHistories.map((payment) => (
                  <TableRow
                    key={payment.year}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {payment.year}
                    </TableCell>
                    <TableCell>{payment.transferName}</TableCell>
                    <TableCell align="right">{getStatusChip(payment)}</TableCell>
                    <TableCell align="right">
                      {new Date(payment.updatedAt).toLocaleDateString("ja")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Heading level={2}>口座情報</Heading>
          <TransferClubFeeView />
        </Box>
      </Stack>

      <TransferNameDialog
        open={openTransferDialog}
        onClose={() => setOpenTransferDialog(false)}
        onSubmit={handleSubmit}
        initialTransferName={currentYearPayment?.transferName ?? ""}
      />

      <ProfileConfirmDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} />
    </>
  );
};

export default PaymentPage;
