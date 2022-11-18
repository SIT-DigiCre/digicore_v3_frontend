export type WorkAuthor = {
  userId: string;
  name: string;
  iconUrl: string;
};
export type WorkTag = {
  tagId: string;
  name: string;
};
export type Work = {
  workId: string;
  name: string;
  authors: WorkAuthor[];
  tags: WorkTag[];
};
export type WorkFile = {
  fileId: string;
  name: string;
};
export type WorkDetail = Work & {
  description: string;
  files: WorkFile[];
};
export type WorkTagDetail = WorkTag & {
  description: string;
};
export type WorkTagUpdate = {
  name: string;
  description: string;
};
export type WorkRequest = {
  name: string;
  description: string;
  authors: string[];
  tags: string[];
  files: string[];
};
