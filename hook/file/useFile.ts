import { useEffect, useState } from "react";
import { FileGetResponse, UploadFile } from "../../interfaces/api";
import { convertToFileObject, FileObject } from "../../interfaces/file";
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
            Authorization: "bearer " + authState.token,
          },
        });
        const fileRes: FileGetResponse = res.data;
        const fileObject: FileObject = convertToFileObject(fileRes);
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
  myFileIds: string[];
  uploadFile: (file: UploadFile) => Promise<FileObject | undefined>;
};

export const useMyFiles: UseMyFiles = () => {
  const [fileIds, setFileIds] = useState<string[]>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/storage`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const fileRes: { file_ids: string[] } = res.data;
        setFileIds(fileRes.file_ids);
        removeError("myfileobjects-get-fail");
      } catch (e: any) {
        setNewError({
          name: "myfileobjects-get-fail",
          message: "個人ファイル一覧の取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  const upload = async (file: UploadFile): Promise<FileObject | undefined> => {
    try {
      const res = await axios.post(`/storage`, file, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      const fileId: string = res.data.id;
      const getRes = await axios.get(`/storage/${fileId}`, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      const fileRes: FileGetResponse = getRes.data;
      const fileObject: FileObject = convertToFileObject(fileRes);
      removeError("myfileobject-post-fail");
      return fileObject;
    } catch (e: any) {
      setNewError({
        name: "myfileobject-post-fail",
        message: "ファイルのアップロードに失敗しました",
      });
      return undefined;
    }
  };

  return {
    myFileIds: fileIds,
    uploadFile: upload,
  };
};
