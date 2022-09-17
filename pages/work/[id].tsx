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
  const work = useWork(id);

  if (!work) return <p>Loading...</p>;
  return (
    <Container>
      <Breadcrumbs
        links={[{ text: "Home", href: "/" }, { text: "Work", href: "/work" }, { text: work.name }]}
      />
      <Grid>
        <h1>{work.name}</h1>
        {work.authers.map((a) => (
          <Avatar src={a.icon_url} />
        ))}
        <ChipList chipList={work.tags.map((t) => t.name)} />
        <hr />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        <MarkdownView md={work.description} />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        {work.files.map((f) => (
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
