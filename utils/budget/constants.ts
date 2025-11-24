import { BudgetClass, BudgetStatus } from "../../interfaces/budget";

export const classDisplay: {
  [K in BudgetClass]: string;
} = {
  room: "部室",
  project: "企画",
  outside: "学外活動",
  fixed: "固定費用",
  festival: "学園祭",
};

export const statusDisplay: {
  [K in BudgetStatus]: string;
} = {
  pending: "申請中",
  reject: "却下",
  approve: "承認済み",
  bought: "購入済み",
  paid: "支払い完了",
};

export const budgetStatusColor: {
  [K in BudgetStatus]:
    | "primary"
    | "error"
    | "success"
    | "warning"
    | "default"
    | "secondary"
    | "info";
} = {
  pending: "default",
  reject: "error",
  approve: "success",
  bought: "secondary",
  paid: "primary",
};
