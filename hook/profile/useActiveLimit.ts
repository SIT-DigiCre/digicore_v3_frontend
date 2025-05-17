import { useEffect } from "react";

import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

import { useMyProfile } from "./useProfile";

type UseActiveLimit = () => [string, () => Promise<boolean>];

export const useActiveLimit: UseActiveLimit = () => {
  const [userProfile] = useMyProfile();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {}, [userProfile]);
  const update = async () => {
    try {
      await axios.put(
        `/user/me/renewal`,
        {},
        {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        },
      );
      removeError("active-limit-renreal-fail");
      return true;
    } catch {
      setNewError({ name: "active-limit-renreal-fail", message: "有効期限の更新に失敗しました" });
      return false;
    }
  };
  return [userProfile?.activeLimit, update];
};
