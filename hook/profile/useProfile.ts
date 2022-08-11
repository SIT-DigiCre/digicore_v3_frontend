import { useEffect, useState } from "react";
import { UserProfileAPIDataResponse, UserProfileAPIData } from "../../interfaces/api";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";
import { axios } from "../../utils/axios";

type UseMyProfile = () => [UserProfileAPIData, (profile: UserProfileAPIData) => Promise<boolean>];

export const useMyProfile: UseMyProfile = () => {
  const [profile, setProfile] = useState<UserProfileAPIData>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/my`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const userProfileAPIDataResponse: UserProfileAPIDataResponse = res.data;
        setProfile(userProfileAPIDataResponse.profile);
        removeError("profile-get-fail");
      } catch (err: any) {
        setNewError({ name: "profile-get-fail", message: "ユーザー情報の取得に失敗しました" });
      }
    })();
  }, [authState]);
  const update = async (profile: UserProfileAPIData) => {
    try {
      const res = await axios.put(`/user/my`, profile, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      setProfile(profile);
      removeError("profile-update-fail");
      return true;
    } catch (err: any) {
      setNewError({ name: "profile-update-fail", message: "ユーザー情報の更新に失敗しました" });
      return false;
    }
  };
  return [profile, update];
};
