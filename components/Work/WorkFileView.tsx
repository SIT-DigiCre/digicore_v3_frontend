import { useFile } from "../../hook/file/useFile";
import FileView from "../File/FileView";

type WorkFileViewProps = {
  fileId: string;
  previewLimit?: boolean;
};

export const WorkFileView = ({ fileId }: WorkFileViewProps) => {
  const file = useFile(fileId);

  if (!file) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return <FileView file={file} />;
};
