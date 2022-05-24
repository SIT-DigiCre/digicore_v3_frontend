import { axios } from "../utils/axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PaymentAPIData } from "../interfaces/api";
import { useAuthState } from "./useAuthState";

type UsePaymentState = () => {
  isLoading: boolean;
  payment: PaymentAPIData;
  setPayment: Dispatch<SetStateAction<PaymentAPIData>>;
  updatePayment: () => Promise<boolean>;
};

export const usePaymentState: UsePaymentState = () => {
  const [payment, setPayment] = useState<PaymentAPIData>();
  const { authState } = useAuthState();
  useEffect(() => {
    if (authState.isLoading) return;
    axios
      .get("user/my/payment", {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      })
      .then((res) => {
        const apiData: PaymentAPIData = res.data;
        setPayment(apiData);
      });
  }, [authState]);
  const updatePayment = async () => {
    const res = await axios.put("user/my/payment", payment, {
      headers: {
        Authorization: "bearer " + authState.token,
      },
    });
    if (res.status === 200) return true;
    return false;
  };
  return {
    isLoading: !payment,
    payment: payment,
    setPayment: setPayment,
    updatePayment: updatePayment,
  };
};
