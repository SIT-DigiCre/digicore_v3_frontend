import { useEffect, useState } from "react";

import { useErrorState } from "../../components/contexts/ErrorStateContext";
import { UploadFile } from "../../interfaces/api";
import { FileInfo, FileObject } from "../../interfaces/file";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";

type UseFile = (fileId: string) => FileObject | undefined;

export const useFile: UseFile = (fileId) => {
  const [file, setFile] = useState<FileObject>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  useEffect(() => {
    if (!authState.isLogined || !authState.token) return;
    (async () => {
      try {
        const res = await apiClient.GET("/storage/{fileId}", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
          params: { path: { fileId } },
        });
        if (res.data) {
          setFile(res.data as unknown as FileObject);
          removeError("fileobject-get-fail");
        }
      } catch {
        setNewError({ message: "ファイルの取得に失敗しました", name: "fileobject-get-fail" });
      }
    })();
  }, [authState.isLogined, authState.token, fileId]);

  return file;
};

type UseMyFiles = () => {
  myFileInfos: FileInfo[] | undefined;
  uploadFile: (file: UploadFile) => Promise<FileObject | string>;
  reloadMyFileIds: () => Promise<void>;
};

export const useMyFiles: UseMyFiles = () => {
  const [fileInfos, setFileInfos] = useState<FileInfo[]>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const loadFiles = async () => {
    if (!authState.isLogined || !authState.token) return;
    try {
      const res = await apiClient.GET("/storage/myfile", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.data?.files) {
        setFileInfos(res.data.files);
        removeError("myfileobjects-get-fail");
      }
    } catch {
      setNewError({
        message: "個人ファイル一覧の取得に失敗しました",
        name: "myfileobjects-get-fail",
      });
    }
  };

  useEffect(() => {
    loadFiles();
  }, [authState.isLogined, authState.token]);

  const upload = async (file: UploadFile): Promise<FileObject | string> => {
    if (!authState.token) return "未ログイン";
    try {
      const res = await apiClient.POST("/storage/myfile", {
        body: file,
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.data) {
        removeError("myfileobject-post-fail");
        return res.data;
      }
      return "アップロードに失敗しました";
    } catch (e: unknown) {
      setNewError({
        message: "ファイルのアップロードに失敗しました",
        name: "myfileobject-post-fail",
      });
      return e instanceof Error ? e.message : "An unknown error occurred";
    }
  };

  return {
    myFileInfos: fileInfos,
    reloadMyFileIds: loadFiles,
    uploadFile: upload,
  };
};
