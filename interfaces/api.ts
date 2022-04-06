import { User } from ".";

export type UserProfileAPIData = {
  id: string;
  student_number: string;
  username: string;
  school_grade: number;
  icon_url: string;
  discord_userid: string;
  active_limit: string;
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
