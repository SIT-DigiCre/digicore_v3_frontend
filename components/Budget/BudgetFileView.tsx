import { useEffect, useRef } from "react";

import { useFile } from "../../hook/file/useFile";
import FileView from "../File/FileView";

type WorkFileViewProps = {
  fileId: string;
};

export const BudgetFileView = ({ fileId }: WorkFileViewProps) => {
  const file = useFile(fileId);
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
  }, [contentRef]);

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
