import { useEffect, useState } from "react"
import { Budget, BudgetDetail, CreateBudgetRequest } from "../../interfaces/budget"
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";
import { axios } from "../../utils/axios";

export const useBudget = (budgetId: string) => {
  const [budget, setBudget] = useState<BudgetDetail>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  useEffect(() => {
    (async () => {
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
    })();
  }, [authState]);

  return {
    budgetDetail: budget,
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
