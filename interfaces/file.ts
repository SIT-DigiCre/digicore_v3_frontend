export type FileInfo = {
  fileId: string;
  userId: string;
  name: string;
  kSize: string;
  extension: string;
  isPublic: boolean;
  createdAt: Date;
  updateAt: Date;
};

export type FileObject = FileInfo & {
  url: string;
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
