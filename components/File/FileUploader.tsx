import { Box, Button, Modal } from "@mui/material";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useMyFiles } from "../../hook/file/useFile";
import { FileObject } from "../../interfaces/file";

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
};
export const FileUploader = ({ open, onCancel, onUploaded }: FileUploaderProps) => {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
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
  const onChangeFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    (async () => {
      const file = e.target.files[0];
      const fileName = file.name;
      const base64 = (await getBase64(file)).split(",")[1];
      const fileObject = await uploadFile({ name: fileName, file: base64, is_public: true });
      onUploaded(fileObject);
      setIsOpen(false);
    })();
  };
  return (
    <Modal open={isOpen}>
      <Box sx={style}>
        <h2>ファイルアップロード</h2>
        <input type="file" onChange={onChangeFileInput} />
        <Button variant="contained" color="error" onClick={onClickCancel}>
          キャンセル
        </Button>
      </Box>
    </Modal>
  );
};
