//招待用URL取得時の型

export type EnvJoinAPIData = {
  discordUrl: string | null;
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
