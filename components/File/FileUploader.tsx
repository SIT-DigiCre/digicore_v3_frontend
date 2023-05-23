import { Alert, Box, Button, LinearProgress, Modal, Typography } from "@mui/material";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useMyFiles } from "../../hook/file/useFile";
import { FileKind, FileObject, getFileExtWithKind } from "../../interfaces/file";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAligin: "center",
};
type FileUploaderProps = {
  open: boolean;
  onCancel: () => void;
  onUploaded: (fileObject: FileObject) => void;
  onlyFileKind?: FileKind;
};
export const FileUploader = ({ open, onCancel, onUploaded, onlyFileKind }: FileUploaderProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [availableExtStr, setAvailableExtStr] = useState<string>(undefined);
  useEffect(() => {
    if (!onlyFileKind) return;
    let extStr = "";
    getFileExtWithKind(onlyFileKind).forEach((ext, i, list) => {
      extStr += "." + ext + (list.length - 1 === i ? "" : ",");
    });
    setAvailableExtStr(extStr);
  }, [onlyFileKind]);
  useEffect(() => {
    setIsOpen(open);
    setErrorMsg(undefined);
  }, [open]);
  const { uploadFile } = useMyFiles();
  const onClickCancel = () => {
    onCancel();
    setIsOpen(false);
  };
  const getBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") reject();
        else resolve(base64);
      };
    });
  };
  const [errorMsg, setErrorMsg] = useState<string>();
  const onChangeFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUploading(true);
    (async () => {
      const file = e.target.files[0];
      const fileName = file.name;
      const base64 = (await getBase64(file)).split(",")[1];
      const fileObject = await uploadFile({ name: fileName, file: base64, isPublic: true });
      if (typeof fileObject === "string") {
        setErrorMsg(fileObject);
        return;
      }
      onUploaded(fileObject);
      setIsOpen(false);
      setUploading(false);
    })();
  };
  const [uploading, setUploading] = useState(false);
  return (
    <Modal open={isOpen}>
      <Box sx={style}>
        <h2>ファイルアップロード</h2>
        <Alert severity="info">ファイル上限: 100MBまで</Alert>
        <input type="file" onChange={onChangeFileInput} accept={availableExtStr} />
        {errorMsg ? <Typography color="error">{errorMsg}</Typography> : <></>}
        {uploading ? <LinearProgress color="success" sx={{ marginTop: 1 }} /> : <></>}
        <Button variant="contained" color="error" onClick={onClickCancel} sx={{ marginTop: 1 }}>
          キャンセル
        </Button>
      </Box>
    </Modal>
  );
};
