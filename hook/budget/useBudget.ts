import { useEffect, useState } from "react";

import {
  CreateBudgetRequest,
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

import type { paths } from "../../utils/fetch/api.d";

type BudgetListResponse =
  paths["/budget"]["get"]["responses"]["200"]["content"]["application/json"];
type BudgetListItem = BudgetListResponse["budgets"][number];

type UseBudgets = (proposerId?: string | "my") => {
  budgets: BudgetListItem[];
  isOver: boolean;
  createBudget: (createBudgetRequest: CreateBudgetRequest) => Promise<string>;
  loadMore: () => void;
};

export const useBudgets: UseBudgets = (proposerId) => {
  const [budgets, setBudgets] = useState<BudgetListItem[]>([]);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [offsetNum, setOffsetNum] = useState(0);
  const [isOver, setIsOver] = useState(false);

  const loadBudgets = async (n: number) => {
    if (!authState.isLogined || !authState.user) return;
    try {
      const { data } = await apiClient.GET("/budget", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          query: {
            offset: n,
            proposerId: proposerId
              ? proposerId === "my"
                ? authState.user.userId!
                : proposerId
              : undefined,
          },
        },
      });
      if (data) {
        // 1ページあたり10件のBudgetが返ってくるため、これより少なければ最後のページに達したと判断する
        if (data.budgets.length < 10) {
          setIsOver(true);
        }
        setBudgets((currentBudgets) => [...currentBudgets, ...data.budgets]);
        removeError("budgets-get-fail");
        setOffsetNum(n);
      }
    } catch (err) {
      if (err && typeof err === "object" && "status" in err && err.status === 400) {
        setIsOver(true);
        return;
      }
      setNewError({
        message: "稟議情報の一覧の取得に失敗しました",
        name: "budgets-get-fail",
      });
    }
  };

  useEffect(() => {
    if (authState.isLogined) {
      loadBudgets(0);
    }
  }, [authState.isLogined]);

  const loadMore = () => {
    loadBudgets(offsetNum + 10);
  };

  const createBudget = async (createBudgetRequest: CreateBudgetRequest): Promise<string> => {
    if (!authState.isLogined) return "ログインしてください";
    try {
      const { data } = await apiClient.POST("/budget", {
        body: createBudgetRequest,
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (data) {
        removeError("budget-post-fail");
        return data.budgetId;
      } else {
        setNewError({ message: "稟議の申請に失敗しました", name: "budget-post-fail" });
        return "error";
      }
    } catch {
      setNewError({ message: "稟議の申請に失敗しました", name: "budget-post-fail" });
      return "error";
    }
  };

  return {
    budgets: budgets,
    createBudget: createBudget,
    isOver: isOver,
    loadMore: loadMore,
  };
};
