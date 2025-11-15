type WorkAuthor = {
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

export type WorkDetail = {
  workId: string;
  name: string;
  description: string;
  authors: {
    userId: string;
    username: string;
    iconUrl: string;
  }[];
  files: {
    fileId: string;
    name: string;
  }[];
  tags: {
    tagId: string;
    name: string;
  }[];
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
