import { ChangeEventHandler, DragEvent, useEffect, useRef, useState } from "react";

import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Fade,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useMyFiles } from "../../hook/file/useFile";
import { FileKind, FileObject, getFileExtWithKind } from "../../interfaces/file";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  outline: "none",
};

type FileUploaderProps = {
  open: boolean;
  onCancel: () => void;
  onUploaded: (fileObject: FileObject) => void;
  onlyFileKind?: FileKind;
};

export const FileUploader = ({ open, onCancel, onUploaded, onlyFileKind }: FileUploaderProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [availableExtStr, setAvailableExtStr] = useState<string | undefined>(undefined);
  const [availableExtensions, setAvailableExtensions] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!onlyFileKind) return;
    const extensions = getFileExtWithKind(onlyFileKind);
    setAvailableExtensions(extensions);
    let extStr = "";
    extensions.forEach((ext, i, list) => {
      extStr += "." + ext + (list.length - 1 === i ? "" : ",");
    });
    setAvailableExtStr(extStr);
  }, [onlyFileKind]);

  useEffect(() => {
    setIsOpen(open);
    setErrorMsg(undefined);
    setSelectedFile(null);
    setUploading(false);
  }, [open]);

  const { uploadFile } = useMyFiles();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const onClickCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  const getBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") reject();
        else resolve(base64);
      };
    });
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setErrorMsg(undefined);
    try {
      const fileName = file.name;
      const base64 = (await getBase64(file)).split(",")[1];
      const fileObject = await uploadFile({ name: fileName, file: base64, isPublic: true });
      if (typeof fileObject === "string") {
        setErrorMsg(fileObject);
        setUploading(false);
        return;
      }
      onUploaded(fileObject);
      setIsOpen(false);
    } catch {
      setErrorMsg("ファイルのアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const onChangeFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };
  return (
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
              ファイルアップロード
            </Typography>
            <IconButton onClick={onClickCancel} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  border: "2px dashed",
                  borderColor: isDragOver ? "primary.main" : "grey.300",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: isDragOver ? "action.hover" : "background.default",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClickUploadArea}
              >
                <Stack spacing={2} alignItems="center">
                  <CloudUploadIcon
                    sx={{
                      fontSize: 48,
                      color: isDragOver ? "primary.main" : "text.secondary",
                    }}
                  />
                  <Typography variant="h6" color="text.primary">
                    ファイルをドラッグ&ドロップ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    または、クリックしてファイルを選択
                  </Typography>

                  {availableExtensions.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: "block" }}
                      >
                        対応ファイル形式:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        {availableExtensions.map((ext) => (
                          <Chip
                            key={ext}
                            label={`.${ext}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>

              {selectedFile && !uploading && (
                <Paper sx={{ p: 2, backgroundColor: "grey.50" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FileIcon color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}

              {uploading && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    アップロード中...
                  </Typography>
                  <LinearProgress color="primary" />
                </Box>
              )}

              {errorMsg && (
                <Alert severity="error" variant="filled">
                  {errorMsg}
                </Alert>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Button variant="outlined" onClick={onClickCancel} disabled={uploading}>
              キャンセル
            </Button>
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            onChange={onChangeFileInput}
            accept={availableExtStr}
            style={{ display: "none" }}
          />
        </Paper>
      </Fade>
    </Modal>
  );
};
