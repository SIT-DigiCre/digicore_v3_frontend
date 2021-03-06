export type User = {
  id?: string;
  username: string;
  studentNumber: string;
  schoolGrade: number;
  iconUrl: string;
  discordUserId?: string;
  activeLimit?: Date;
  firstName?: string;
  lastName?: string;
  firstNameKana?: string;
  lastNameKana?: string;
  phoneNumber?: string;
  address?: string;
  parentName?: string;
  parentCellPhoneNumber?: string;
  parentHomePhoneNumber?: string;
  parentAddress?: string;
  self_introduction?: string;
  shortSelfIntroduction?: string;
};

export type ErrorState = {
  name: string;
  count?: number;
  message: string;
};
