import { Modal, Box, Button, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useFile, useMyFiles } from "../../hook/file/useFile";
import { FileObject } from "../../interfaces/file";
import { FileUploader } from "./FileUploader";
type FileBrowserModalProps = {
  open: boolean;
  onCancel: () => void;
  onSelected: (file: FileObject) => void;
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
export const FileBrowserModal = ({ open, onCancel, onSelected }: FileBrowserModalProps) => {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  const { myFileIds } = useMyFiles();
  const onClickCancel = () => {
    setIsOpen(false);
    onCancel();
  };
  const onClickListItem = (file: FileObject) => {
    onSelected(file);
    setIsOpen(false);
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
            <List>
              {myFileIds.map((fId) => (
                <FileListItem fileId={fId} onClick={onClickListItem} key={fId} />
              ))}
            </List>
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
  onClick: (file: FileObject) => void;
};
const FileListItem = ({ fileId, onClick }: FileListItemProps) => {
  const file = useFile(fileId);
  return (
    <ListItemButton
      onClick={() => {
        if (!file) return;
        onClick(file);
      }}
    >
      <ListItemText>{file ? file.name + file.extension : "Loading..."}</ListItemText>
    </ListItemButton>
  );
};
