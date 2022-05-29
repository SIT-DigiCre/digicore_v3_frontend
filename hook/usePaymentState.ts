import { axios } from "../utils/axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetPaymentAPIData, GetPaymentHistoryAPIData, PaymentAPIData } from "../interfaces/api";
import { useAuthState } from "./useAuthState";

type UsePaymentState = () => {
  isLoading: boolean;
  latestPayment: PaymentAPIData;
  paymentHistory: PaymentAPIData[];
  setLatestPayment: Dispatch<SetStateAction<PaymentAPIData>>;
  updateLatestPayment: () => Promise<boolean>;
};

export const usePaymentState: UsePaymentState = () => {
  const [latestPayment, setLatestPayment] = useState<PaymentAPIData>();
  const [paymentHistory, setPaymentHistory] = useState<PaymentAPIData[]>();
  const { authState } = useAuthState();
  useEffect(() => {
    if (authState.isLoading || !authState.isLogined) return;
    const getData = async () => {
      const historyRes = await axios.get("user/my/payment/history", {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      const history: GetPaymentHistoryAPIData = historyRes.data;
      if (historyRes.status !== 200) return;
      setPaymentHistory(history.payments);
      try {
        const res = await axios.get("user/my/payment", {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const payment: GetPaymentAPIData = res.data;
        if (res.status === 200) setLatestPayment(payment.payment);
      } catch (e) {
        setLatestPayment({
          year: new Date().getFullYear(),
          transfer_name: "",
          checked: false,
        });
      }
    };
    getData();
  }, [authState]);
  const updatePayment = async () => {
    const res = await axios.put("user/my/payment", latestPayment, {
      headers: {
        Authorization: "bearer " + authState.token,
      },
    });
    if (res.status === 200) return true;
    return false;
  };
  return {
    isLoading: !latestPayment,
    latestPayment: latestPayment,
    paymentHistory: paymentHistory,
    setLatestPayment: setLatestPayment,
    updateLatestPayment: updatePayment,
  };
};
