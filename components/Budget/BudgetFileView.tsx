import { useRef } from "react";

import { useFile } from "../../hook/file/useFile";
import FileView from "../File/FileView";

type WorkFileViewProps = {
  fileId: string;
};

export const BudgetFileView = ({ fileId }: WorkFileViewProps) => {
  const file = useFile(fileId);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!file) {
    return (
      <div
        ref={contentRef}
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <p>読み込み中...</p>
      </div>
    );
  }

  return <FileView file={file} />;
};
