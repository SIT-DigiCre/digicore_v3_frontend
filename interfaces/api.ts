//招待用URL取得時の型

export type EnvJoinAPIData = {
  discordUrl: string;
};

export type GroupAPIData = {
  id: string;
  name: string;
  description: string;
  join: boolean;
  joined: boolean;
};

export type GroupsAPIData = {
  groups: GroupAPIData[];
  error?: string;
};

export type UserProfileLite = {
  id: string;
  username: string;
  icon_url: string;
  short_self_introduction: string;
};
export type UsersAPIData = {
  profiles: UserProfileLite[];
  error?: string;
};

// file

export type UploadFile = {
  name: string;
  file: string;
  isPublic: boolean;
};

// Mattermost
export type MattermostRegistrationRequest = {
  username: string;
  password: string;
  nickname: string;
};
