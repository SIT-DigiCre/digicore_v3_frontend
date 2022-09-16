export type WorkAuther = {
  id: string;
  name: string;
  icon_url: string;
};
export type WorkTag = {
  id: string;
  name: string;
};
export type Work = {
  id: string;
  name: string;
  authers: WorkAuther[];
  tags: WorkTag[];
};
export type WorkFile = {
  id: string;
  name: string;
};
export type WorkDetail = Work & {
  description: string;
  files: WorkFile[];
};
export type WorkTagDetail = WorkTag & {};
export type WorkRequest = {
  name: string;
  description: string;
  authers: string[];
  tags: string[];
  files: string[];
};