import { ListItemIcon, ListItemText } from "@mui/material";
import { useFile } from "../../hook/file/useFile";
import { getFileKind } from "../../interfaces/file";
import FileKindIcon from "../File/FileKindIcon";

type Props = {
  fileId: string;
};

const WorkListItem = ({ fileId }: Props) => {
  const file = useFile(fileId);
  if (!file) return <p>Loading...</p>;
  return (
    <>
      {getFileKind(file.extension) === "image" ? (
        <img src={file.url} alt="" style={{ height: "100px" }} />
      ) : (
        <ListItemIcon>
          <FileKindIcon kind={getFileKind(file.extension)} />
        </ListItemIcon>
      )}
      <ListItemText>{file.name}</ListItemText>
    </>
  );
};

export default WorkListItem;
