import { BudgetClass, BudgetStatus } from "../../interfaces/budget";

export const classDisplay: {
  [K in BudgetClass]: string;
} = {
  festival: "学園祭",
  fixed: "固定費用",
  outside: "学外活動",
  project: "企画",
  room: "部室",
};

export const statusDisplay: {
  [K in BudgetStatus]: string;
} = {
  approve: "承認済み",
  bought: "購入済み",
  paid: "支払い完了",
  pending: "申請中",
  reject: "却下",
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
  approve: "success",
  bought: "secondary",
  paid: "primary",
  pending: "default",
  reject: "error",
};
