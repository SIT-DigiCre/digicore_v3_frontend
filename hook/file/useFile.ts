import { useEffect, useState } from "react";
import { UploadFile } from "../../interfaces/api";
import { FileInfo, FileObject } from "../../interfaces/file";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseFile = (fileId: string) => FileObject;

export const useFile: UseFile = (fileId) => {
  const [file, setFile] = useState<FileObject>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/storage/${fileId}`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const fileObject: FileObject = res.data;
        setFile(fileObject);
        removeError("fileobject-get-fail");
      } catch (e: any) {
        setNewError({ name: "fileobject-get-fail", message: "ファイルの取得に失敗しました" });
      }
    })();
  }, [authState]);
  return file;
};

type UseMyFiles = () => {
  myFileInfos: FileInfo[];
  uploadFile: (file: UploadFile) => Promise<FileObject | string>;
  reloadMyFileIds: () => Promise<void>;
};

export const useMyFiles: UseMyFiles = () => {
  const [fileInfos, setFileInfos] = useState<FileInfo[]>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const loadFiles = async () => {
    if (!authState.isLogined) return;
    try {
      const res = await axios.get(`/storage/myfile`, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const filesRes: FileInfo[] = res.data.files;
      setFileInfos(filesRes);
      removeError("myfileobjects-get-fail");
    } catch (e: any) {
      setNewError({
        name: "myfileobjects-get-fail",
        message: "個人ファイル一覧の取得に失敗しました",
      });
    }
  };
  useEffect(() => {
    loadFiles();
  }, [authState]);
  const upload = async (file: UploadFile): Promise<FileObject | string> => {
    try {
      const res = await axios.post(`/storage/myfile`, file, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const fileObject: FileObject = res.data;
      removeError("myfileobject-post-fail");
      return fileObject;
    } catch (e: any) {
      setNewError({
        name: "myfileobject-post-fail",
        message: "ファイルのアップロードに失敗しました",
      });
      return e.response.data.error || e.message;
    }
  };

  return {
    myFileInfos: fileInfos,
    uploadFile: upload,
    reloadMyFileIds: loadFiles,
  };
};
