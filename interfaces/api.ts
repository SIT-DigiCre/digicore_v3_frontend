//招待用URL取得時の型

export type EnvJoinAPIData = {
  slack_url: string;
  discord_url: string;
};

//部費支払い情報取得時の型
export type PaymentAPIData = {
  year: number;
  transfer_name: string;
  checked: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type GetPaymentAPIData = {
  payment: PaymentAPIData;
  error: string;
};

export type GetPaymentHistoryAPIData = {
  payments: PaymentAPIData[];
  error: string;
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

export type FileGetResponse = {
  id: string;
  user_id: string;
  name: string;
  k_size: string;
  extension: string;
  is_public: boolean;
  created_at: string;
  update_at: string;
  url: string;
};

export type UploadFile = {
  name: string;
  file: string;
  is_public: boolean;
};

// Mattermost
export type MattermostRegistrationRequest = {
  username: string;
  password: string;
  nickname: string;
};
