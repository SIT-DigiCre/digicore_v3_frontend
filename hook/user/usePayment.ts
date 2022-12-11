import { useEffect, useState } from "react";
import { PaymentHistory } from "../../interfaces/form";
import { axios } from "../../utils/axios";
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
    try {
      const res = await axios.get("user/me/payment", {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const histories: PaymentHistory[] = res.data.histories;
      console.log(histories);
      setPaymentHistories(histories);

      removeError("payment-get");
    } catch (e: any) {
      setNewError({ name: "payment-get", message: "部費支払い情報の取得に失敗しました" });
    }
  };
  useEffect(() => {
    if (!authState.isLogined) return;
    getHistories();
  }, [authState]);
  const updatePayment = async (name) => {
    try {
      await axios.put(
        "user/me/payment",
        { transferName: name },
        {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        },
      );
      getHistories();
    } catch (e: any) {
      return false;
    }
    return true;
  };
  return {
    paymentHistories,
    updatePayment,
  };
};
