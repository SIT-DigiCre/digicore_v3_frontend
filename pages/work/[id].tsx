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
import { axios } from "../../utils/axios";
import { useAuthState } from "../../hook/useAuthState";
import Head from "next/head";

type Props = {
  id: string;
  modeStr?: string;
  error?: string;
  workPublic?: WorkPublic;
};
type WorkPublicAuthor = {
  userId: string;
  username: string;
  iconUrl: string;
};
type WorkPublicTag = {
  tagId: string;
  name: string;
};
type WorkPublic = {
  workId: string;
  name: string;
  description: string;
  authors: WorkPublicAuthor[];
  fileUrl: string;
  fileName: string;
  tags: WorkPublicTag[];
};
const WorkDetailPage = ({ id, modeStr, error, workPublic }: Props) => {
  const { workDetail, updateWork, deleteWork } = useWork(id);
  const { authState } = useAuthState();
  const router = useRouter();
  const onSubmit = (workRequest: WorkRequest) => {
    updateWork(workRequest).then((result) => {
      if (!result) return;
      router.push(`/work/${id}`);
    });
  };
  if (!authState.isLogined)
    return (
      <>
        <Head>
          <meta property="og:title" content={workPublic.name} />
          <meta property="og:discription" content={workPublic.description} />
          <meta property="og:url" content={"https://core3.digicre.net/work/" + workPublic.workId} />
          <meta property="og:image" content={workPublic.fileUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="デジコアWork" />
          <meta name="twitter:card" content="summary_large_image"></meta>
        </Head>
      </>
    );
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
    const res = await axios.get(`/work/work/${id}/public`);
    let work: WorkPublic = res.data;
    work.description = work.description.substring(0, 100);
    console.log(work);
    return { props: { id, modeStr, workPublic: work } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
