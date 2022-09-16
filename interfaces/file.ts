import { FileGetResponse } from "./api";

export type FileObject = {
  id: string;
  user_id: string;
  name: string;
  k_size: string;
  extension: string;
  is_public: boolean;
  created_at: Date;
  update_at: Date;
  url: string;
};
export const convertToFileObject = (response: FileGetResponse): FileObject => {
  return {
    id: response.id,
    user_id: response.user_id,
    name: response.name,
    k_size: response.k_size,
    extension: response.extension,
    is_public: response.is_public,
    created_at: new Date(response.created_at),
    update_at: new Date(response.update_at),
    url: response.url,
  };
};

export type FileKind =
  | "image"
  | "video"
  | "text"
  | "model"
  | "audio"
  | "zip"
  | "pdf"
  | "pptx"
  | "docx"
  | "xlsx"
  | "exe"
  | "apk"
  | "other";
export const getFileKind = (ext: string): FileKind => {
  const imageExts = ["jpeg", "jpg", "png", "gif"];
  if (imageExts.includes(ext.toLocaleLowerCase())) return "image";
  const videoExts = ["mp4"];
  if (videoExts.includes(ext.toLocaleLowerCase())) return "video";
  const textExts = ["txt"]; //後でプログラムコードなども追加する
  if (textExts.includes(ext.toLocaleLowerCase())) return "text";
  //modelは後々対応
  const audioExts = ["mp3", "wav", "m4a"];
  if (audioExts.includes(ext.toLocaleLowerCase())) return "audio";
  const singleKinds = ["zip", "pdf", "pptx", "docx", "xlsx", "exe", "apk"];
  if (singleKinds.includes(ext.toLocaleLowerCase())) return ext.toLocaleLowerCase() as FileKind;

  return "other";
};
