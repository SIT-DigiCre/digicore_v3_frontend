import { useEffect, useState } from "react";

import { useRecoilValue } from "recoil";

import { userListSeed } from "../../atom/userAtom";
import { UserProfile } from "../../interfaces/user";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseUserProfiles = () => {
  userProfiles: UserProfile[];
  requestMoreProfiles: () => void;
  isOver: boolean;
};

export const useUserProfiles: UseUserProfiles = () => {
  const { authState } = useAuthState();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { setNewError, removeError } = useErrorState();
  const [offsetNum, setOffsetNum] = useState(0);
  const seed = useRecoilValue(userListSeed);
  const [isOver, setIsOver] = useState(false);

  const getNew = async () => {
    if (authState.isLoading || !authState.isLogined) return;
    try {
      const { data } = await apiClient.GET("/user", {
        params: {
          query: {
            offset: offsetNum,
            seed: seed,
          },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (!data) {
        setNewError({ name: "userprofiles-get-fail", message: "部員一覧の取得に失敗しました" });
        return;
      }
      // 1ページあたり100件のユーザー情報が返ってくるため、これより少なければ最後のページに達したと判断する
      if (data.users.length < 100) {
        setIsOver(true);
      }
      const newUsers = [...users, ...data.users];
      setUsers(newUsers);
      setOffsetNum(newUsers.length);
      removeError("userprofiles-get-fail");
    } catch {
      setNewError({ name: "userprofiles-get-fail", message: "部員一覧の取得に失敗しました" });
    }
  };

  useEffect(() => {
    (async () => {
      getNew();
    })();
  }, [authState]);

  const requestMoreProfiles = () => {
    if (isOver) return;
    (async () => {
      getNew();
    })();
  };

  return {
    userProfiles: users,
    requestMoreProfiles: requestMoreProfiles,
    isOver: isOver,
  };
};
