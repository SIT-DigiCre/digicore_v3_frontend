import { useEffect, useState } from "react";

import { DEFAULT_USER_PRIVATE_PROFILE, UserPrivateProfile } from "../../interfaces/user";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UsePrivateProfile = (
  register?: boolean,
) => [UserPrivateProfile, (privateProfile: UserPrivateProfile) => Promise<boolean>];

export const usePrivateProfile: UsePrivateProfile = (register) => {
  const registerMode = register ? register : false;
  const [profile, setProfile] = useState<UserPrivateProfile>(DEFAULT_USER_PRIVATE_PROFILE);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    if (registerMode) return;
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/me/private`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const userPrivateProfile: UserPrivateProfile = res.data;
        setProfile(userPrivateProfile);
        removeError("privateprofile-get-fail");
      } catch {
        setNewError({
          name: "privateprofile-get-fail",
          message: "ユーザーの非公開情報の取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  const update = async (profile: UserPrivateProfile) => {
    try {
      await axios.put(`/user/me/private`, profile, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      setProfile(profile);
      removeError("privateprofile-update-fail");
      return true;
    } catch {
      setNewError({
        name: "privateprofile-update-fail",
        message: "ユーザー情報の更新に失敗しました",
      });
      return false;
    }
  };
  return [profile, update];
};
