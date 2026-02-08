import {
  PutBudgetAdminRequest,
  PutBudgetStatusApproveRequest,
  PutBudgetStatusBoughtRequest,
  PutBudgetStatusPaidRequest,
  PutBudgetStatusPendingRequest,
} from "../../interfaces/budget";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

export const useBudgetActions = (budgetId: string) => {
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const updateBudgetStatusPending = async (
    budgetRequest: PutBudgetStatusPendingRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_pending", {
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の更新に失敗しました", name: "budget-put-fail" });
      return false;
    }
  };

  const updateBudgetStatusApprove = async (
    budgetRequest: PutBudgetStatusApproveRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_approve", {
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の更新に失敗しました", name: "budget-put-fail" });
      return false;
    }
  };

  const updateBudgetStatusBought = async (
    budgetRequest: PutBudgetStatusBoughtRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_bought", {
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の更新に失敗しました", name: "budget-put-fail" });
      return false;
    }
  };

  const updateBudgetStatusPaid = async (
    budgetRequest: PutBudgetStatusPaidRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_paid", {
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の更新に失敗しました", name: "budget-put-fail" });
      return false;
    }
  };

  const updateAdminBudget = async (budgetRequest: PutBudgetAdminRequest): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/admin", {
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の更新に失敗しました", name: "budget-put-fail" });
      return false;
    }
  };

  const deleteBudgetStatusPending = async (): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.DELETE("/budget/{budgetId}/status_pending", {
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-delete-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の削除に失敗しました", name: "budget-delete-fail" });
      return false;
    }
  };

  const deleteBudgetStatusApprove = async (): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.DELETE("/budget/{budgetId}/status_approve", {
        headers: { Authorization: `Bearer ${authState.token}` },
        params: { path: { budgetId } },
      });
      removeError("budget-delete-fail");
      return true;
    } catch {
      setNewError({ message: "稟議の削除に失敗しました", name: "budget-delete-fail" });
      return false;
    }
  };

  return {
    deleteBudgetStatusApprove,
    deleteBudgetStatusPending,
    updateAdminBudget,
    updateBudgetStatusApprove,
    updateBudgetStatusBought,
    updateBudgetStatusPaid,
    updateBudgetStatusPending,
  };
};
