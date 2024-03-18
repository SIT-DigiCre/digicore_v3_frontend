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

export type PutBudgetStatusPendingRequest = {
  name: string;
  budget: number;
  purpose: string;
  mattermostUrl: string;
  remark: string;
  files: string[];
}

export type PutBudgetStatusApproveRequest = {
  settlement: number;
  remark: string;
  bought: boolean;
  files: string[];
}

export type PutBudgetStatusBoughtRequest = {
  settlement: number;
  remark: string;
  files: string[];
}

export type PutBudgetStatusPaidRequest = {
  remark: string;
}

export type PutBudgetRequest = PutBudgetStatusPendingRequest & PutBudgetStatusApproveRequest & PutBudgetStatusBoughtRequest & PutBudgetStatusPaidRequest;
