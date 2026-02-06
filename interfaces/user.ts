export type User = {
  userId?: string;
  username: string;
  studentNumber: string;
  iconUrl: string;
  schoolGrade: number;
  discordUserId: string;
  shortIntroduction: string;
  activeLimit?: string;
  isAdmin: boolean;
};

export const DEFAULT_USER: User = {
  activeLimit: "",
  discordUserId: "",
  iconUrl: "",
  isAdmin: false,
  schoolGrade: 0,
  shortIntroduction: "",
  studentNumber: "",
  userId: "",
  username: "",
};

export type UserProfile = {
  userId: string;
  username: string;
  iconUrl: string;
  shortIntroduction: string;
};

export type UserPrivateProfile = {
  address: string;
  firstName: string;
  firstNameKana: string;
  isMale: boolean;
  lastName: string;
  lastNameKana: string;
  parentAddress: string;
  parentCellphoneNumber: string;
  parentFirstName: string;
  parentHomephoneNumber: string;
  parentLastName: string;
  parentName: string;
  phoneNumber: string;
};

export const DEFAULT_USER_PRIVATE_PROFILE: UserPrivateProfile = {
  address: "",
  firstName: "",
  firstNameKana: "",
  isMale: true,
  lastName: "",
  lastNameKana: "",
  parentAddress: "",
  parentCellphoneNumber: "",
  parentFirstName: "",
  parentHomephoneNumber: "",
  parentLastName: "",
  parentName: "",
  phoneNumber: "",
};
