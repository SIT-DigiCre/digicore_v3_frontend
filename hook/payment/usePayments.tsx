import { useEffect, useState } from "react";

import { Payment } from "../../interfaces/payment";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UsePayments = () => [
  Payment[],
  (paymentId: string, checked: boolean, note: string) => Promise<boolean>,
];

export const usePayments: UsePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/payment`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const payments: Payment[] = res.data.payments;
        setPayments(payments);
        removeError("payments-get-fail");
      } catch {
        setNewError({
          name: "payments-get-fail",
          message: "支払情報の一覧の取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  const update = async (paymentId: string, checked: boolean, note: string) => {
    try {
      await axios.put(
        `/payment/${paymentId}`,
        { checked: checked, note: note },
        {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        },
      );
      const index = payments.findIndex((payment) => payment.paymentId === paymentId);
      payments[index].checked = checked;
      payments[index].note = note;
      setPayments([...payments]);
      removeError("payments-update-fail");
      return true;
    } catch {
      setNewError({ name: "payments-update-fail", message: "支払情報の更新に失敗しました" });
      return false;
    }
  };
  return [payments, update];
};
