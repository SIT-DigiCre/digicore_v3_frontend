import AudioFileIcon from "@mui/icons-material/AudioFile";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MovieIcon from "@mui/icons-material/Movie";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { Icon } from "@mui/material";

import { FileKind } from "../../interfaces/file";

type Props = {
  kind: FileKind;
};
const FileKindIcon = ({ kind }: Props) => {
  switch (kind) {
    case "image":
      return <ImageIcon />;
    case "video":
      return <MovieIcon />;
    case "text":
      return <TextSnippetIcon />;
    case "model":
      return <ViewInArIcon />;
    case "audio":
      return <AudioFileIcon />;
    case "zip":
      return <FolderZipIcon />;
    case "pdf":
      return <PictureAsPdfIcon />;
    case "pptx":
      return (
        <Icon>
          <img
            src="/image/fileicon/microsoft-powerpoint.svg"
            alt="PowerPoint"
            style={{ maxWidth: "100%" }}
          />
        </Icon>
      );
    case "docx":
      return (
        <Icon>
          <img src="/image/fileicon/microsoft-word.svg" alt="Word" style={{ maxWidth: "100%" }} />
        </Icon>
      );
    case "xlsx":
      return (
        <Icon>
          <img src="/image/fileicon/microsoft-excel.svg" alt="Excel" style={{ maxWidth: "100%" }} />
        </Icon>
      );
    case "exe":
      return (
        <Icon>
          <img src="/image/fileicon/windows-11.svg" alt="Windows" style={{ maxWidth: "100%" }} />
        </Icon>
      );
    case "apk":
      return (
        <Icon>
          <img src="/image/fileicon/android.svg" alt="Android" style={{ maxWidth: "100%" }} />
        </Icon>
      );
    default:
      return <InsertDriveFileIcon />;
  }
};
export default FileKindIcon;
