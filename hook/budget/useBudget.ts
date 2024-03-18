import { useEffect, useState } from "react"
import { Budget, BudgetDetail, CreateBudgetRequest, PutBudgetAdminRequest, PutBudgetRequest, PutBudgetStatusApproveRequest, PutBudgetStatusBoughtRequest, PutBudgetStatusPaidRequest, PutBudgetStatusPendingRequest } from "../../interfaces/budget"
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";
import { axios } from "../../utils/axios";

export const useBudget = (budgetId: string) => {
  const [budget, setBudget] = useState<BudgetDetail>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const fetchBudget = async () => {
    if (!authState.isLogined) return;
    try {
      const res = await axios.get(`/budget/${budgetId}`, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const budgetDetail: BudgetDetail = res.data;
      setBudget(budgetDetail);
      removeError("budgetdetail-get-fail");
    } catch (e: any) {
      setNewError({ name: "budgetdetail-get-fail", message: "稟議の取得に失敗しました" });
    }
  }

  useEffect(() => {
    fetchBudget();
  }, [authState]);

  const updateBudgetStatusPending = async (budgetRequest: PutBudgetStatusPendingRequest): Promise<boolean> => {
    try {
      const body: PutBudgetStatusPendingRequest = {
        budget: budgetRequest.budget,
        files: budgetRequest.files,
        mattermostUrl: budgetRequest.mattermostUrl,
        name: budgetRequest.name,
        purpose: budgetRequest.purpose,
        remark: budgetRequest.remark,
      };
      const res = await axios.put(`/budget/${budgetId}/status_pending`, body, {
        headers: {
          Authorization: "Bearer " + authState.token,
        }
      });
      removeError("budget-put-fail");
      await fetchBudget();  // update 後に詳細ページ側の値が更新されないので再度 fetch する
      return true;
    } catch (e: any) {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" })
      return false;
    }
  }

  const updateBudgetStatusApprove = async (budgetRequest: PutBudgetStatusApproveRequest): Promise<boolean> => {
    try {
      const body: PutBudgetStatusApproveRequest = {
        bought: budgetRequest.bought,
        files: budgetRequest.files,
        remark: budgetRequest.remark,
        settlement: budgetRequest.settlement,
      };
      const res = await axios.put(`/budget/${budgetId}/status_approve`, body, {
        headers: {
          Authorization: "Bearer " + authState.token,
        }
      });
      removeError("budget-put-fail");
      await fetchBudget();  // update 後に詳細ページ側の値が更新されないので再度 fetch する
      return true;
    } catch (e: any) {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" })
      return false;
    }
  }

  const updateBudgetStatusBought = async (budgetRequest: PutBudgetStatusBoughtRequest): Promise<boolean> => {
    try {
      const body: PutBudgetStatusBoughtRequest = {
        files: budgetRequest.files,
        remark: budgetRequest.remark,
        settlement: budgetRequest.settlement,
      };
      const res = await axios.put(`/budget/${budgetId}/status_bought`, body, {
        headers: {
          Authorization: "Bearer " + authState.token,
        }
      });
      removeError("budget-put-fail");
      await fetchBudget();  // update 後に詳細ページ側の値が更新されないので再度 fetch する
      return true;
    } catch (e: any) {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" })
      return false;
    }
  }

  const updateBudgetStatusPaid = async (budgetRequest: PutBudgetStatusPaidRequest): Promise<boolean> => {
    try {
      const body: PutBudgetStatusPaidRequest = {
        remark: budgetRequest.remark,
      };
      const res = await axios.put(`/budget/${budgetId}/status_paid`, body, {
        headers: {
          Authorization: "Bearer " + authState.token,
        }
      });
      removeError("budget-put-fail");
      await fetchBudget();  // update 後に詳細ページ側の値が更新されないので再度 fetch する
      return true;
    } catch (e: any) {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" })
      return false;
    }
  }

  const updateAdminBudget = async (budgetRequest: PutBudgetAdminRequest): Promise<boolean> => {
    try {
      const body: PutBudgetAdminRequest = {
        status: budgetRequest.status,
      };
      const res = await axios.put(`/budget/${budgetId}/admin`, body, {
        headers: {
          Authorization: "Bearer " + authState.token,
        }
      });
      removeError("budget-put-fail");
      await fetchBudget();
      return true;
    } catch (e: any) {
      setNewError({ name: "budget-put-fail", message: "稟議の更新に失敗しました" });
      return false;
    }
  }

  return {
    budgetDetail: budget,
    updateBudgetStatusPending,
    updateBudgetStatusApprove,
    updateBudgetStatusBought,
    updateBudgetStatusPaid,
    updateAdminBudget,
  };
}

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const fetchBudgets = async () => {
    if (!authState.isLogined) return;
    try {
      const res = await axios.get(`/budget`, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const budgets: Budget[] = res.data.budgets;
      setBudgets(budgets);
      removeError("budgets-get-fail");
    } catch (err: any) {
      setNewError({
        name: "budgets-get-fail",
        message: "稟議情報の一覧の取得に失敗しました",
      });
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [authState]);

  const createBudget = async (createBudgetRequest: CreateBudgetRequest): Promise<string> => {
    if (!authState.isLogined) return "ログインしてください";
    try {
      const res = await axios.post(`/budget`, createBudgetRequest, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      removeError("budget-post-fail");
      return res.data.budgetId;
    } catch (err: any) {
      setNewError({ name: "budget-post-fail", message: "稟議の申請に失敗しました" });
      return "error";
    }
  };

  return {
    budgets: budgets,
    createBudget: createBudget,
  };
}
