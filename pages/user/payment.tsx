// user/joined.tsx を雛形にして作成する

import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthState } from "../../hook/useAuthState";
import { PaymentAPIData } from "../../interfaces/api";
import { axios } from "../../utils/axios";
const PaymentPage = () => {
  const { authState } = useAuthState();

  const [paymentData, setPaymentData] = useState<PaymentAPIData>();
  useEffect(() => {
    if (authState.isLoading || !authState.isLogined) return;
    axios
      .get("/user/my/payment/", {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      })
      .then((res) => {
        const paymentAPIData: PaymentAPIData = res.data;
        setPaymentData(paymentAPIData);
      });
  }, [authState]);
  if (authState.isLoading || !authState.isLogined || !paymentData) return <p>Loading...</p>;
  return (
    <>
      <Container>
        <Grid>
          <h2>部費振り込み完了報告ページ</h2>
          <Typography>
            振り込みは済みましたか？お困りであれば <a href="./joined">こちら</a>のページまで。
            {/* 一時的な文章 */}
          </Typography>
        </Grid>
      </Container>
    </>
  );
};

export default PaymentPage;
