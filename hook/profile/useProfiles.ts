import { useEffect, useState } from "react";

import { UserProfile } from "../../interfaces/user";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

export const useProfiles = (userIds: string[]): UserProfile[] => {
  const { authState } = useAuthState();
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const { setNewError, removeError } = useErrorState();

  const getProfiles = async (ids: string[]) => {
    if (authState.isLoading || !authState.isLogined) return;
    try {
      ids.forEach(async (userId) => {
        const { data } = await apiClient.GET("/user/{userId}", {
          params: { path: { userId } },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setUserProfiles((prevProfiles) => {
          if (prevProfiles.find((profile) => profile.userId === data.userId)) {
            return prevProfiles;
          }
          return [...prevProfiles, data];
        });
      });
      removeError("userprofiles-get-fail");
    } catch {
      setNewError({ name: "userprofiles-get-fail", message: "部員情報の取得に失敗しました" });
    }
  };

  useEffect(() => {
    setUserProfiles([]);
    getProfiles(userIds);
  }, [authState, userIds]);

  return userProfiles;
};
