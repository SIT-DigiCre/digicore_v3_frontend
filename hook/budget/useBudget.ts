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
        params: { path: { budgetId } },
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" });
      return false;
    }
  };

  const updateBudgetStatusApprove = async (
    budgetRequest: PutBudgetStatusApproveRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_approve", {
        params: { path: { budgetId } },
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" });
      return false;
    }
  };

  const updateBudgetStatusBought = async (
    budgetRequest: PutBudgetStatusBoughtRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_bought", {
        params: { path: { budgetId } },
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" });
      return false;
    }
  };

  const updateBudgetStatusPaid = async (
    budgetRequest: PutBudgetStatusPaidRequest,
  ): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/status_paid", {
        params: { path: { budgetId } },
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" });
      return false;
    }
  };

  const updateAdminBudget = async (budgetRequest: PutBudgetAdminRequest): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.PUT("/budget/{budgetId}/admin", {
        params: { path: { budgetId } },
        body: budgetRequest,
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-put-fail");
      return true;
    } catch {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" });
      return false;
    }
  };

  const deleteBudgetStatusPending = async (): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.DELETE("/budget/{budgetId}/status_pending", {
        params: { path: { budgetId } },
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-delete-fail");
      return true;
    } catch {
      setNewError({ name: "budget-delete-fail", message: "稟議の削除に失敗しました" });
      return false;
    }
  };

  const deleteBudgetStatusApprove = async (): Promise<boolean> => {
    if (!authState.token) return false;
    try {
      await apiClient.DELETE("/budget/{budgetId}/status_approve", {
        params: { path: { budgetId } },
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      removeError("budget-delete-fail");
      return true;
    } catch {
      setNewError({ name: "budget-delete-fail", message: "稟議の削除に失敗しました" });
      return false;
    }
  };

  return {
    updateBudgetStatusPending,
    updateBudgetStatusApprove,
    updateBudgetStatusBought,
    updateBudgetStatusPaid,
    updateAdminBudget,
    deleteBudgetStatusPending,
    deleteBudgetStatusApprove,
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
        headers: {
          Authorization: `Bearer ${authState.token}`,
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
        name: "budgets-get-fail",
        message: "稟議情報の一覧の取得に失敗しました",
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
        setNewError({ name: "budget-post-fail", message: "稟議の申請に失敗しました" });
        return "error";
      }
    } catch {
      setNewError({ name: "budget-post-fail", message: "稟議の申請に失敗しました" });
      return "error";
    }
  };

  return {
    budgets: budgets,
    isOver: isOver,
    createBudget: createBudget,
    loadMore: loadMore,
  };
};
