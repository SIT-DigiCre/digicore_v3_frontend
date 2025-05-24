import { useEffect, useState } from "react";

import { User } from "../../interfaces/user";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseMyProfile = () => [User, (profile: User) => Promise<boolean>];

export const useMyProfile: UseMyProfile = () => {
  const [profile, setProfile] = useState<User>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/me`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const user: User = res.data;
        setProfile(user);
        removeError("profile-get-fail");
      } catch {
        setNewError({ name: "profile-get-fail", message: "ユーザー情報の取得に失敗しました" });
      }
    })();
  }, [authState]);
  const update = async (profile: User) => {
    try {
      await axios.put(`/user/me`, profile, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      setProfile(profile);
      removeError("profile-update-fail");
      return true;
    } catch {
      setNewError({ name: "profile-update-fail", message: "ユーザー情報の更新に失敗しました" });
      return false;
    }
  };
  return [profile, update];
};

type UseProfile = (id: string) => User;

export const useProfile: UseProfile = (id: string) => {
  const [profile, setProfile] = useState<User>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/${id}`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const user: User = res.data;
        setProfile(user);
        removeError("profile-get-fail");
      } catch {
        setNewError({ name: "profile-get-fail", message: "ユーザー情報の取得に失敗しました" });
      }
    })();
  }, [authState]);
  return profile;
};
