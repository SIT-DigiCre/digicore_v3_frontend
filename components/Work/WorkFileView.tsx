import { useEffect, useRef, useState } from "react";
import { useFile } from "../../hook/file/useFile";
import FileView from "../File/FileView";
import ElementResizeListener from "../Common/ElementResizeListener";
import FileKindIcon from "../File/FileKindIcon";
import { getFileKind } from "../../interfaces/file";
import { Fab } from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";

type WorkFileViewProps = {
  fileId: string;
  previewLimit?: boolean;
};
export const WorkFileView = ({ fileId, previewLimit }: WorkFileViewProps) => {
  const file = useFile(fileId);
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [view, setView] = useState(!previewLimit);
  const [height, setHeight] = useState(100);
  useEffect(() => {
    if (!contentRef.current) return;
    setHeight((contentRef.current.getBoundingClientRect().width * 10) / 16);
  }, [contentRef]);
  if (!file)
    return (
      <div
        ref={contentRef}
        style={{
          width: "100%",
          textAlign: "center",
          height: `${height}px`,
        }}
      >
        <p>Loading...</p>
      </div>
    );
  if (file.extension === "pptx" && !view)
    return (
      <div
        ref={contentRef}
        style={{
          width: "100%",
          textAlign: "center",
          height: `${height}px`,
          fontSize: "20px",
        }}
      >
        <ElementResizeListener
          onResize={(e) => {
            setHeight((contentRef.current.getBoundingClientRect().width * 10) / 16);
          }}
        />
        <FileKindIcon kind={getFileKind(file.extension)} />
        PowerPointファイル
        <br />
        <Fab
          variant="extended"
          onClick={(e) => {
            e.stopPropagation();
            setView(true);
          }}
        >
          <PageviewIcon sx={{ mr: 1 }} />
          表示
        </Fab>
      </div>
    );
  return <FileView file={file} />;
};
