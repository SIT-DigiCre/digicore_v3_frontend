import { useEffect, useState } from "react";
import { Payment } from "../../interfaces/payment";
import { DEFAULT_USER_PRIVATE_PROFILE, UserPrivateProfile } from "../../interfaces/user";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UsePayments = () => [Payment[], (paymentId: string, checked: boolean, note: string) => Promise<boolean>];

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
      } catch (err: any) {
        setNewError({
          name: "payments-get-fail",
          message: "支払情報の一覧の取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  const update = async (paymentId: string, checked: boolean, note: string) => {
    try {
      const res = await axios.put(`/payment/${paymentId}`, { checked: checked, note: note }, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const index = payments.findIndex((payment) => payment.paymentId === paymentId);
      payments[index].checked = checked;
      setPayments([...payments]);
      removeError("payments-update-fail");
      return true;
    } catch (err: any) {
      setNewError({ name: "payments-update-fail", message: "支払情報の更新に失敗しました" });
      return false;
    }
  };
  return [payments, update];
};
