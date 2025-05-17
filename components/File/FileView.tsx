import { useEffect, useRef, useState } from "react";

import { FileObject, getFileKind } from "../../interfaces/file";
import ElementResizeListener from "../Common/ElementResizeListener";

type Props = {
  file: FileObject;
  width?: number;
};
const FileView = ({ file, width }: Props) => {
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [contentWidth, setContentWidth] = useState(100);
  const [contentHight, setContentHight] = useState(100);
  const onResize = (event: Event) => {
    // eslint-disable-next-line no-console
    console.log(event);
    setContentWidth(contentRef.current.getBoundingClientRect().width);
    setContentHight((contentRef.current.getBoundingClientRect().width * 10) / 16);
  };

  useEffect(() => {
    setContentWidth(contentRef.current.getBoundingClientRect().width);
    setContentHight((contentRef.current.getBoundingClientRect().width * 10) / 16);
  }, []);
  const getFileTag = () => {
    switch (getFileKind(file.extension)) {
      case "image":
        return <img src={file.url} style={{ maxWidth: "100%" }} />;
      case "docx":
      case "xlsx":
      case "pptx":
        return (
          <iframe
            src={"https://view.officeapps.live.com/op/embed.aspx?src=" + file.url}
            width={width ? width : contentWidth}
            height={width ? (width * 10) / 16 : contentHight}
            frameBorder="0"
          />
        );
      case "video":
        return <video src={file.url} style={{ maxWidth: "100%" }} controls />;
      case "audio":
        return (
          <>
            <p>{file.name}</p>
            <audio src={file.url} controls></audio>
          </>
        );
      case "exe":
        return (
          <>
            <a href={file.url}>{file.name}</a>
            <p>注意！実行形式ファイル</p>
          </>
        );
      default:
        return <a href={file.url}>{file.name}</a>;
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
