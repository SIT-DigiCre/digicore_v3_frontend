import { useEffect, useState } from "react";
import { UserPrivateAPIData, UserPrivateAPIDataResponse } from "../../interfaces/api";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UsePrivateProfile = () => [
  UserPrivateAPIData,
  (privateProfile: UserPrivateAPIData) => Promise<boolean>,
];

export const usePrivateProfile: UsePrivateProfile = () => {
  const [profile, setProfile] = useState<UserPrivateAPIData>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/my/private/`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const userProfileAPIDataResponse: UserPrivateAPIDataResponse = res.data;
        setProfile(userProfileAPIDataResponse.private_profile);
        removeError("privateprofile-get-fail");
      } catch (err: any) {
        setNewError({
          name: "privateprofile-get-fail",
          message: "ユーザーの非公開情報の取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  const update = async (profile: UserPrivateAPIData) => {
    try {
      const res = await axios.put(`/user/my/private/`, profile, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      setProfile(profile);
      removeError("privateprofile-update-fail");
      return true;
    } catch (err: any) {
      setNewError({
        name: "privateprofile-update-fail",
        message: "ユーザー情報の更新に失敗しました",
      });
      return false;
    }
  };
  return [profile, update];
};
