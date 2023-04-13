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
export const imageExts = ["jpeg", "jpg", "png", "gif"];
export const videoExts = ["mp4"];
export const textExts = ["txt"]; //後でプログラムコードなども追加する
export const audioExts = ["mp3", "wav", "m4a"];
export const singleKinds = ["zip", "pdf", "pptx", "docx", "xlsx", "exe", "apk"];
export const getFileKind = (ext: string): FileKind => {
  if (imageExts.includes(ext.toLocaleLowerCase())) return "image";
  if (videoExts.includes(ext.toLocaleLowerCase())) return "video";
  if (textExts.includes(ext.toLocaleLowerCase())) return "text";
  //modelは後々対応
  if (audioExts.includes(ext.toLocaleLowerCase())) return "audio";
  if (singleKinds.includes(ext.toLocaleLowerCase())) return ext.toLocaleLowerCase() as FileKind;
  return "other";
};
export const getFileExtWithKind = (kind: FileKind): string[] => {
  switch (kind) {
    case "image":
      return imageExts;
    case "video":
      return videoExts;
    case "text":
      return textExts;
    case "model":
      return [];
    case "audio":
      return audioExts;
    case "zip":
      return ["zip"];
    case "pdf":
      return ["pdf"];
    case "pptx":
      return ["pptx"];
    case "docx":
      return ["docx"];
    case "xlsx":
      return ["xlsx"];
    case "exe":
      return ["exe"];
    case "apk":
      return ["apk"];
    default:
      return [];
  }
};
