import { useEffect, useState } from "react";

import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  IconButton,
  List,
  ListItemButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

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

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  maxWidth: 700,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  outline: "none",
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
  const { myFileInfos, reloadMyFileIds } = useMyFiles();
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
      <Modal open={isOpen} onClose={onClickCancel} closeAfterTransition>
        <Fade in={isOpen}>
          <Paper sx={modalStyle} elevation={8}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" component="h2" fontWeight="bold">
                ファイルを選択
              </Typography>
              <IconButton onClick={onClickCancel} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "400px",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  {myFileInfos ? (
                    <List sx={{ p: 0 }}>
                      {myFileInfos.map((info) => (
                        <FileListItem
                          fileId={info.fileId}
                          onClick={onClickListItem}
                          onlyFileKind={onlyFileKind}
                          key={info.fileId}
                        />
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        読み込み中...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button variant="outlined" onClick={onClickCancel}>
                キャンセル
              </Button>
              <Button variant="contained" onClick={onClickUpload} startIcon={<CloudUploadIcon />}>
                アップロード
              </Button>
            </Box>

            <FileUploader
              open={isUploadModalOpen}
              onCancel={() => {
                setIsUploadModalOpen(false);
              }}
              onUploaded={onClickListItem}
            />
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

type FileListItemProps = {
  fileId: string;
  onlyFileKind?: FileKind;
  onClick: (file: FileObject) => void;
};

const FileListItem = ({ fileId, onClick, onlyFileKind }: FileListItemProps) => {
  const file = useFile(fileId);
  const getDisable = (fk?: FileKind, fo?: FileObject) => {
    if (!fk) return false;
    return fo ? getFileKind(fo.extension) !== onlyFileKind : true;
  };

  const isDisabled = getDisable(onlyFileKind, file);

  return (
    <ListItemButton
      onClick={() => {
        if (!file) return;
        onClick(file);
      }}
      disabled={isDisabled}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
        "&:hover": {
          backgroundColor: isDisabled ? "transparent" : "action.hover",
        },
        opacity: isDisabled ? 0.5 : 1,
        py: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        {file ? (
          <>
            {getFileKind(file.extension) === "image" ? (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={file.url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "grey.100",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <FileKindIcon kind={getFileKind(file.extension)} />
              </Box>
            )}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                fontWeight="medium"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {file.extension.toUpperCase()} ファイル
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                mr: 2,
                backgroundColor: "grey.200",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                ...
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              読み込み中...
            </Typography>
          </Box>
        )}
      </Box>
    </ListItemButton>
  );
};
