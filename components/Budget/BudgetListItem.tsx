import { ListItemIcon, ListItemText } from "@mui/material";

import { useFile } from "../../hook/file/useFile";
import { getFileKind } from "../../interfaces/file";
import FileKindIcon from "../File/FileKindIcon";

type BudgetListItemProps = {
  fileId: string;
};

const BudgetListItem = ({ fileId }: BudgetListItemProps) => {
  const file = useFile(fileId);
  if (!file) return <p>読み込み中...</p>;

  return (
    <>
      {getFileKind(file.extension) === "image" ? (
        <img src={file.url} alt={file.name} style={{ height: "100px" }} />
      ) : (
        <ListItemIcon>
          <FileKindIcon kind={getFileKind(file.extension)} />
        </ListItemIcon>
      )}
      <ListItemText>{file.name}</ListItemText>
    </>
  );
};

export default BudgetListItem;
