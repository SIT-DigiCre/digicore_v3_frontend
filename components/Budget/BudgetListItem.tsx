import Image from "next/image";

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
        <Image
          alt={file.name}
          height={100}
          src={file.url}
          unoptimized
          width={100}
          style={{ height: "100px", objectFit: "contain" }}
        />
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
