import { useEffect, useState } from "react";
import { UserProfileLite, UsersAPIData } from "../../interfaces/api";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseUserProfiles = () => {
  userProfiles: UserProfileLite[];
  requestMoreProfiles: () => void;
};

export const useUserProfiles: UseUserProfiles = () => {
  const { authState } = useAuthState();
  const [users, setUsers] = useState<UserProfileLite[]>([]);
  const { setNewError, removeError } = useErrorState();
  const [pageNum, setPageNum] = useState(0);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100));
  const [isOver, setIsOver] = useState(false);
  const getNew = async (num: number) => {
    if (authState.isLoading || !authState.isLogined) return;
    try {
      const res = await axios.get(`/user?pages=${num}&seed=${seed}`, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      const usersData: UsersAPIData = res.data;
      if (usersData.profiles.length === 0) setIsOver(true);
      setUsers(users.concat(usersData.profiles));
      removeError("userprofiles-get-fail");
    } catch (err: any) {
      setNewError({ name: "userprofiles-get-fail", message: "ユーザー一覧の取得に失敗しました" });
    }
  };
  useEffect(() => {
    (async () => {
      getNew(0);
    })();
  }, [authState]);
  const requestMoreProfiles = () => {
    if (isOver) return;
    setPageNum(pageNum + 100);
    (async () => {
      getNew(pageNum + 100);
    })();
  };
  return {
    userProfiles: users,
    requestMoreProfiles: requestMoreProfiles,
  };
};
