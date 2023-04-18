import { useWork } from "../../hook/work/useWork";
import MarkdownView from "../Common/MarkdownView";
import { WorkFileView } from "./WorkFileView";

type Props = {
  id: string;
};
export const WorkCardPreview = ({ id }: Props) => {
  const { workDetail } = useWork(id);
  if (!workDetail) return <p>Loading...</p>;
  if (!workDetail.files || workDetail.files.length === 0)
    return <MarkdownView md={workDetail.description.substring(0, 120)} />;
  return <WorkFileView fileId={workDetail.files[0].fileId} previewLimit={true} />;
};
