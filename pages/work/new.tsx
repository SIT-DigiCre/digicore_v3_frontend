import { useRouter } from "next/router";

import { Grid } from "@mui/material";

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
      <Grid>
        <Heading level={1}>Work新規作成</Heading>
        <hr />
      </Grid>
      <WorkEditor onSubmit={onSubmit} />
    </>
  );
};
export default WorkCreatePage;
