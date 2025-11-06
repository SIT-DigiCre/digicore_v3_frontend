import { useRouter } from "next/router";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import WorkEditor from "../../components/Work/WorkEditor";
import { useWorks } from "../../hook/work/useWork";
import { WorkRequest } from "../../interfaces/work";

const WorkCreatePage = () => {
  const router = useRouter();
  const { createWork } = useWorks();

  const onSubmit = (workRequest: WorkRequest) => {
    (async () => {
      const res = await createWork(workRequest);
      if (res === "error") return;
      router.push(`/work/${res}`);
    })();
  };

  return (
    <>
      <PageHead title="Work新規作成" />
      <Breadcrumbs
        links={[{ text: "Home", href: "/" }, { text: "User", href: "/work" }, { text: "新規作成" }]}
      />
      <Heading level={2}>Work新規作成</Heading>
      <WorkEditor onSubmit={onSubmit} />
    </>
  );
};
export default WorkCreatePage;
