export type User = {
  userId?: string;
  username: string;
  studentNumber: string;
  iconUrl: string;
  schoolGrade: number;
  discordUserId: string;
  shortIntroduction: string;
  activeLimit?: string;
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
  parentHomephoneNumber: string;
  parentName: string;
  phoneNumber: string;
};

export type FullUser = User & UserPrivateProfile;
