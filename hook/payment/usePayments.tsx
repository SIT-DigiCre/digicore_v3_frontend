import { useEffect, useState } from "react";

import { Payment } from "../../interfaces/payment";
import { apiClient } from "../../utils/fetch/client";
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
        const { response, data } = await apiClient.GET(`/payment`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        if (response.status === 403) {
          setNewError({
            name: "payments-get-fail",
            message: "この情報を表示する権限がありません",
          });
        } else if (data) {
          setPayments(data.payments);
          removeError("payments-get-fail");
        } else {
          setNewError({ name: "payments-get-fail", message: "支払情報の一覧の取得に失敗しました" });
        }
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
      await apiClient.PUT(`/payment/{paymentId}`, {
        params: {
          path: {
            paymentId,
          },
        },
        body: { checked: checked, note: note },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
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
