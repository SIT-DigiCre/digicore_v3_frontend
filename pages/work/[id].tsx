import { Avatar, Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ChipList from "../../components/Common/ChipList";
import MarkdownView from "../../components/Common/MarkdownView";
import PageHead from "../../components/Common/PageHead";
import WorkEditor from "../../components/Work/WorkEditor";
import { WorkFileView } from "../../components/Work/WorkFileView";
import { useWork } from "../../hook/work/useWork";
import { WorkRequest } from "../../interfaces/work";

type Props = {
  id: string;
  modeStr?: string;
  error?: string;
};
const WorkDetailPage = ({ id, modeStr, error }: Props) => {
  const { workDetail, updateWork, deleteWork } = useWork(id);
  const router = useRouter();
  const onSubmit = (workRequest: WorkRequest) => {
    updateWork(workRequest).then((result) => {
      if (!result) return;
      router.push(`/work/${id}`);
    });
  };

  if (!workDetail) return <p>Loading...</p>;
  return (
    <Container>
      <PageHead title={workDetail.name} />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: "Work", href: "/work" },
          { text: workDetail.name },
        ]}
      />
      {modeStr === "edit" ? (
        <>
          <WorkEditor onSubmit={onSubmit} initWork={workDetail} />
        </>
      ) : (
        <>
          <Grid>
            <h1>{workDetail.name}</h1>
            {workDetail.authors
              ? workDetail.authors.map((a) => (
                  <div
                    onClick={() => {
                      router.push(`/user/${a.userId}`);
                    }}
                    className="clickable d-inlineblock"
                  >
                    <Avatar src={a.iconUrl} className="d-inlineblock" />
                  </div>
                ))
              : ""}
            {workDetail.tags ? <ChipList chipList={workDetail.tags.map((t) => t.name)} /> : ""}

            <hr />
          </Grid>
          <Grid sx={{ marginTop: 3 }}>
            <MarkdownView md={workDetail.description} />
          </Grid>
          <Grid sx={{ marginTop: 3 }}>
            {workDetail.files
              ? workDetail.files.map((f) => <WorkFileView fileId={f.fileId} />)
              : ""}
          </Grid>
        </>
      )}
    </Container>
  );
};
export default WorkDetailPage;
export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const id = params?.id;
    const { mode } = query;
    const modeStr = typeof mode === "string" ? mode : null;
    return { props: { id, modeStr } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
