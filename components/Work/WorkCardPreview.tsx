import { WorkFile } from "../../interfaces/work";
import MarkdownView from "../Markdown/MarkdownView";

import { WorkFileView } from "./WorkFileView";

type Props = {
  description: string;
  files: WorkFile[];
};

export const WorkCardPreview = ({ description, files }: Props) => {
  if (!files || files.length === 0) {
    return <MarkdownView md={description.substring(0, 120)} />;
  }

  return <WorkFileView fileId={files[0].fileId} />;
};
