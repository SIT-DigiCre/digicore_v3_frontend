import { Avatar, Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ChipList from "../../components/Common/ChipList";
import MarkdownView from "../../components/Common/MarkdownView";
import FileView from "../../components/File/FileView";
import { useFile } from "../../hook/file/useFile";
import { useWork } from "../../hook/work/useWork";

type Props = {
  id: string;
  error?: string;
};
const WorkDetailPage = ({ id, error }: Props) => {
  const { workDetail, updateWork, deleteWork } = useWork(id);

  if (!workDetail) return <p>Loading...</p>;
  return (
    <Container>
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: "Work", href: "/work" },
          { text: workDetail.name },
        ]}
      />
      <Grid>
        <h1>{workDetail.name}</h1>
        {workDetail.authers.map((a) => (
          <Avatar src={a.icon_url} />
        ))}
        <ChipList chipList={workDetail.tags.map((t) => t.name)} />
        <hr />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        <MarkdownView md={workDetail.description} />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        {workDetail.files.map((f) => (
          <WorkFileView fileId={f.id} />
        ))}
      </Grid>
    </Container>
  );
};
export default WorkDetailPage;
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    return { props: { id } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
type WorkFileViewProps = {
  fileId: string;
};
const WorkFileView = ({ fileId }: WorkFileViewProps) => {
  const file = useFile(fileId);
  if (!file) return <p>Loading...</p>;
  return <FileView file={file} />;
};
