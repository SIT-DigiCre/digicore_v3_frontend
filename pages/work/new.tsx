import { Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useWorks } from "../../hook/work/useWork";
import { WorkRequest } from "../../interfaces/work";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import WorkEditor from "../../components/work/WorkEditor";

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
    <Container>
      <Breadcrumbs
        links={[{ text: "Home", href: "/" }, { text: "User", href: "/work" }, { text: "新規作成" }]}
      />
      <Grid>
        <h1>Work新規作成</h1>
        <hr />
      </Grid>
      <WorkEditor onSubmit={onSubmit} />
    </Container>
  );
};
export default WorkCreatePage;
