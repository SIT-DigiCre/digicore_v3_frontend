export type BudgetClass = "festival" | "fixed" | "project" | "outside" | "room";

export type BudgetStatus = "pending" | "reject" | "approve" | "bought" | "paid";

export type BudgetProposer = {
  userId: string;
  username: string;
  iconUrl: string;
}

export type Budget = {
  userId: string;
  username: string;
  iconUrl: string;
  budgetId: string;
  name: string;
  class: BudgetClass;
  status: BudgetStatus;
  settlement: number;
  budget: number;
  updatedAt: string;
  proposer: BudgetProposer;
}

export type CreateBudgetRequest = {
  name: string;
  class: BudgetClass;
  proposerUserId: string;
}
