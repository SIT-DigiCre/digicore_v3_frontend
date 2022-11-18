import { axios } from "../utils/axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetPaymentAPIData, GetPaymentHistoryAPIData, PaymentAPIData } from "../interfaces/api";
import { useAuthState } from "./useAuthState";
import { useErrorState } from "./useErrorState";

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
  const [isLoading, setIsLoading] = useState(true);
  const { authState } = useAuthState();
  const { setNewError } = useErrorState();
  useEffect(() => {
    if (authState.isLoading || !authState.isLogined) return;
    const getData = async () => {
      const historyRes = await axios.get("user/me/payment", {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const history: GetPaymentHistoryAPIData = historyRes.data.histories;
      if (historyRes.status !== 200) {
        setNewError({ name: "payment-get", message: "部費支払い情報の取得に失敗しました" });
        return;
      }
      setPaymentHistory(history.payments);
      setIsLoading(true);
    };
    getData();
  }, [authState]);
  const updatePayment = async () => {
    const res = await axios.put("user/my/payment", latestPayment, {
      headers: {
        Authorization: "Bearer " + authState.token,
      },
    });
    if (res.status === 200) return true;
    setNewError({ name: "payment-update", message: "部費支払い情報の更新に失敗しました" });
    return false;
  };
  return {
    isLoading: isLoading,
    latestPayment: latestPayment,
    paymentHistory: paymentHistory,
    setLatestPayment: setLatestPayment,
    updateLatestPayment: updatePayment,
  };
};
