import { WorkFile } from "../../interfaces/work";
import MarkdownView from "../Markdown/MarkdownView";
import { WorkFileView } from "./WorkFileView";

type Props = {
  description: string;
  firstFile: WorkFile | null;
};

export const WorkCardPreview = ({ description, firstFile }: Props) => {
  if (!firstFile) {
    return <MarkdownView md={description.substring(0, 120)} />;
  }

  return <WorkFileView fileId={firstFile.fileId} />;
};
