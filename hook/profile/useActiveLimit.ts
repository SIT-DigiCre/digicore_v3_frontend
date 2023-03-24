import { useEffect, useState } from "react";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";
import { axios } from "../../utils/axios";
import { User } from "../../interfaces/user";
import { useMyProfile } from "./useProfile";

type UseActiveLimit = () => [string, () => Promise<boolean>];

export const useActiveLimit: UseActiveLimit = () => {
  const [userProfile] = useMyProfile();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
  }, [userProfile]);
  const update = async () => {
    try {
      const res = await axios.put(`/user/me/renewal`,{}, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      removeError("active-limit-renreal-fail");
      return true;
    } catch (err: any) {
      setNewError({ name: "active-limit-renreal-fail", message: "有効期限の更新に失敗しました" });
      return false;
    }
  };
  return [userProfile?.activeLimit, update];
};
