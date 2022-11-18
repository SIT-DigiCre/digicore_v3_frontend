import { useFile } from "../../hook/file/useFile";
import FileView from "../File/FileView";

type WorkFileViewProps = {
  fileId: string;
};
export const WorkFileView = ({ fileId }: WorkFileViewProps) => {
  const file = useFile(fileId);
  if (!file) return <p>Loading...</p>;
  return <FileView file={file} />;
};
