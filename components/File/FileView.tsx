import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FileObject, getFileKind } from "../../interfaces/file";
import ElementResizeListener from "../Common/ElementResizeListener";

type FileViewProps = {
  file: FileObject;
  width?: number;
};

const FileView = ({ file, width }: FileViewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(100);
  const [contentHight, setContentHight] = useState(100);

  const onResize = () => {
    if (!contentRef.current) return;
    setContentWidth(contentRef.current.getBoundingClientRect().width);
    setContentHight((contentRef.current.getBoundingClientRect().width * 10) / 16);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    setContentWidth(contentRef.current.getBoundingClientRect().width);
    setContentHight((contentRef.current.getBoundingClientRect().width * 10) / 16);
  }, []);

  const getFileTag = () => {
    switch (getFileKind(file.extension)) {
      case "image":
        return (
          <Image
            alt={file.name}
            height={contentHight}
            src={file.url}
            unoptimized
            width={contentWidth}
            style={{ maxWidth: "100%" }}
          />
        );
      case "docx":
      case "xlsx":
      case "pptx":
        return (
          <iframe
            src={"https://view.officeapps.live.com/op/embed.aspx?src=" + file.url}
            title="Office ドキュメントプレビュー"
            width={width ? width : contentWidth}
            height={width ? (width * 10) / 16 : contentHight}
            frameBorder="0"
          />
        );
      case "video":
        return (
          <video src={file.url} style={{ maxWidth: "100%" }} controls>
            <track kind="captions" />
          </video>
        );
      case "audio":
        return (
          <>
            <p>{file.name}</p>
            <audio src={file.url} controls>
              <track kind="captions" />
            </audio>
          </>
        );
      case "exe":
        return (
          <>
            <Link
              href={file.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {file.name}
            </Link>
            <p>注意！実行形式ファイル</p>
          </>
        );
      default:
        return (
          <Link
            href={file.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {file.name}
          </Link>
        );
    }
  };

  return (
    <div ref={contentRef} style={{ width: "100%" }}>
      <ElementResizeListener onResize={onResize} />
      {getFileTag()}
    </div>
  );
};

export default FileView;
