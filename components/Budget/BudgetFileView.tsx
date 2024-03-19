import { useEffect, useRef, useState } from "react";
import { useFile } from "../../hook/file/useFile";
import FileView from "../File/FileView";

type WorkFileViewProps = {
  fileId: string;
  previewLimit?: boolean;
};
export const BudgetFileView = ({ fileId, previewLimit }: WorkFileViewProps) => {
  const file = useFile(fileId);
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    if (!contentRef.current) return;
  }, [contentRef]);
  if (!file)
    return (
      <div
        ref={contentRef}
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  return <FileView file={file} />;
};
