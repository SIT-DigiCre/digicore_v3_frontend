import {
  Modal,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFile, useMyFiles } from "../../hook/file/useFile";
import { FileKind, FileObject, getFileKind } from "../../interfaces/file";
import FileKindIcon from "./FileKindIcon";
import { FileUploader } from "./FileUploader";
type FileBrowserModalProps = {
  open: boolean;
  onCancel: () => void;
  onSelected: (file: FileObject) => void;
  onlyFileKind?: FileKind;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export const FileBrowserModal = ({
  open,
  onCancel,
  onSelected,
  onlyFileKind,
}: FileBrowserModalProps) => {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
    reloadMyFileIds();
  }, [open]);
  const { myFileIds, reloadMyFileIds } = useMyFiles();
  const onClickCancel = () => {
    setIsOpen(false);
    onCancel();
  };
  const onClickListItem = (file: FileObject) => {
    if (!file) return;
    if (onlyFileKind && getFileKind(file.extension) !== onlyFileKind) return;
    onSelected(file);
    setIsOpen(false);
    setIsUploadModalOpen(false);
    reloadMyFileIds();
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const onClickUpload = () => {
    setIsUploadModalOpen(true);
  };
  return (
    <>
      <Modal open={isOpen}>
        <Box sx={style}>
          <h2>ファイルを選択</h2>
          <div style={{ overflowY: "auto", height: "400px" }}>
            {myFileIds ? (
              <List>
                {myFileIds.map((fId) => (
                  <FileListItem
                    fileId={fId}
                    onClick={onClickListItem}
                    onlyFileKind={onlyFileKind}
                    key={fId}
                  />
                ))}
              </List>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div>
            <Button variant="contained" color="error" onClick={onClickCancel}>
              キャンセル
            </Button>
            <Button variant="contained" onClick={onClickUpload}>
              アップロード
            </Button>
          </div>
          <FileUploader
            open={isUploadModalOpen}
            onCancel={() => {
              setIsUploadModalOpen(false);
            }}
            onUploaded={onClickListItem}
          />
        </Box>
      </Modal>
    </>
  );
};
type FileListItemProps = {
  fileId: string;
  onlyFileKind: FileKind;
  onClick: (file: FileObject) => void;
};
const FileListItem = ({ fileId, onClick, onlyFileKind }: FileListItemProps) => {
  const file = useFile(fileId);
  const getDisable = (fk: FileKind, fo: FileObject) => {
    if (!fk) return false;
    return fo ? getFileKind(fo.extension) !== onlyFileKind : true;
  };
  return (
    <ListItemButton
      onClick={() => {
        if (!file) return;
        onClick(file);
      }}
      disabled={getDisable(onlyFileKind, file)}
    >
      {file ? (
        <>
          {getFileKind(file.extension) === "image" ? (
            <img src={file.url} alt="" style={{ height: "100px" }} />
          ) : (
            <ListItemIcon>
              <FileKindIcon kind={getFileKind(file.extension)} />
            </ListItemIcon>
          )}
        </>
      ) : (
        <></>
      )}

      <ListItemText>{file ? file.name : "Loading..."}</ListItemText>
    </ListItemButton>
  );
};
