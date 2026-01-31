import { useEffect, useState } from "react";

import { PaymentHistory } from "../../interfaces/form";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UsePayment = () => {
  paymentHistories: PaymentHistory[];
  updatePayment: (name: string) => Promise<boolean>;
};

export const usePayment: UsePayment = () => {
  const [paymentHistories, setPaymentHistories] = useState<PaymentHistory[]>([]);
  const { setNewError, removeError } = useErrorState();
  const { authState } = useAuthState();

  const getHistories = async () => {
    if (!authState.token) return;
    try {
      const res = await apiClient.GET("/user/me/payment", {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      if (res.data?.histories) {
        const histories: PaymentHistory[] = res.data.histories.map((h) => ({
          ...h,
          updatedAt: new Date(h.updatedAt),
        }));
        setPaymentHistories(histories);
        removeError("payment-get");
      }
    } catch {
      setNewError({ name: "payment-get", message: "部費支払い情報の取得に失敗しました" });
    }
  };

  useEffect(() => {
    if (!authState.isLogined) return;
    getHistories();
  }, [authState.isLogined, authState.token]);

  const updatePayment = async (name: string) => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/user/me/payment", {
        body: { transferName: name },
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      await getHistories();
      return true;
    } catch {
      return false;
    }
  };

  return {
    paymentHistories,
    updatePayment,
  };
};
