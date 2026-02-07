import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import BudgetEditor from "../../../components/Budget/BudgetEditor";
import PageHead from "../../../components/Common/PageHead";
import { useBudgetActions } from "../../../hook/budget/useBudget";
import { BudgetDetail, PutBudgetRequest } from "../../../interfaces/budget";
import { createServerApiClient } from "../../../utils/fetch/client";

type BudgetEditPageProps = {
  id: string;
  budget: Required<BudgetDetail>;
};

const BudgetEditPage = ({ id, budget: budgetDetail }: BudgetEditPageProps) => {
  const router = useRouter();
  const {
    updateBudgetStatusApprove,
    updateBudgetStatusBought,
    updateBudgetStatusPaid,
    updateBudgetStatusPending,
  } = useBudgetActions(id);

  const onSubmit = (budgetRequest: PutBudgetRequest) => {
    switch (budgetDetail.status) {
      case "pending":
        updateBudgetStatusPending(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
      case "approve":
        updateBudgetStatusApprove(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
      case "bought":
        updateBudgetStatusBought(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
      case "paid":
        updateBudgetStatusPaid(budgetRequest).then((result) => {
          if (!result) return;
          router.push(`/budget/${id}`);
        });
        break;
    }
  };

  return (
    <>
      <PageHead title={`${budgetDetail.name} - 編集`} />
      <BudgetEditor onSubmit={onSubmit} initBudget={budgetDetail} />
    </>
  );
};

export default BudgetEditPage;

export const getServerSideProps: GetServerSideProps<BudgetEditPageProps> = async ({
  params,
  req,
}) => {
  const id = params?.id;
  if (!id || typeof id !== "string") return { notFound: true };
  const client = createServerApiClient(req);
  const res = await client.GET("/budget/{budgetId}", {
    params: { path: { budgetId: id } },
  });
  if (!res.data) return { notFound: true };
  // TODO: Zodを導入する
  return {
    props: {
      budget: res.data as Required<BudgetDetail>,
      id,
    },
  };
};
