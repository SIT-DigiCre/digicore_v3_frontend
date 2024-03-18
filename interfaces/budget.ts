export type BudgetClass = "festival" | "fixed" | "project" | "outside" | "room";

export type BudgetStatus = "pending" | "reject" | "approve" | "bought" | "paid";

export type BudgetProposer = {
  userId: string;
  username: string;
  iconUrl: string;
}

export type BudgetApprover = {
  userId: string;
  username: string;
  iconUrl: string;
}

export type BudgetFile = {
  fileId: string;
  name: string;
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

export type BudgetDetail = Budget & {
  purpose: string;
  mattermostUrl: string;
  approver?: BudgetApprover;
  files: BudgetFile[];
  createdAt: string;
  approvedAt?: string;
  remark: string;
}

export type CreateBudgetRequest = {
  name: string;
  class: BudgetClass;
  proposerUserId: string;
}
