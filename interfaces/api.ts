import { User } from "./index";

export type UserProfileAPIData = {
  id?: string;
  student_number: string;
  username: string;
  school_grade: number;
  icon_url: string;
  discord_userid: string;
  active_limit?: string;
  short_self_introduction: string;
};

export type UserProfileAPIDataResponse = {
  profile: UserProfileAPIData;
  error: string;
};

export const convertUserFromUserProfile: (
  userProfileResponse: UserProfileAPIDataResponse,
) => User = (userProfileResponse) => {
  const user: User = {
    id: userProfileResponse.profile.id,
    studentNumber: userProfileResponse.profile.student_number,
    username: userProfileResponse.profile.username,
    schoolGrade: userProfileResponse.profile.school_grade,
    iconUrl: userProfileResponse.profile.icon_url,
    discordUserId: userProfileResponse.profile.discord_userid,
    activeLimit: new Date(userProfileResponse.profile.active_limit),
    shortSelfIntroduction: userProfileResponse.profile.short_self_introduction,
  };
  return user;
};
export const convertUserProfileFromUser: (user: User) => UserProfileAPIData = (user) => {
  const userProfile: UserProfileAPIData = {
    student_number: user.studentNumber,
    username: user.username,
    school_grade: user.schoolGrade,
    icon_url: user.iconUrl,
    discord_userid: user.discordUserId,
    short_self_introduction: user.shortSelfIntroduction,
  };
  return userProfile;
};
export type UserPrivateAPIData = {
  address: string;
  first_name: string;
  first_name_kana: string;
  last_name: string;
  last_name_kana: string;
  parent_address: string;
  parent_cellphone_number: string;
  parent_homephone_number: string;
  parent_name: string;
  phone_number: string;
};

export type UserPrivateAPIDataResponse = {
  private_profile: UserPrivateAPIData;
  error: string;
};
export const convertUserPrivateFromUser: (user: User) => UserPrivateAPIData = (user) => {
  const userPrivate: UserPrivateAPIData = {
    address: user.address,
    first_name: user.firstName,
    first_name_kana: user.firstNameKana,
    last_name: user.lastName,
    last_name_kana: user.lastNameKana,
    parent_address: user.parentAddress,
    parent_cellphone_number: user.parentCellPhoneNumber,
    parent_homephone_number: user.parentHomePhoneNumber,
    parent_name: user.parentName,
    phone_number: user.phoneNumber,
  };
  return userPrivate;
};

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
