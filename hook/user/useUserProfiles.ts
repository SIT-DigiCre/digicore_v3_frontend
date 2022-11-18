import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userListSeed } from "../../atom/userAtom";
import { UserProfileLite, UsersAPIData } from "../../interfaces/api";
import { User } from "../../interfaces/user";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseUserProfiles = () => {
  userProfiles: User[];
  requestMoreProfiles: () => void;
};

export const useUserProfiles: UseUserProfiles = () => {
  const { authState } = useAuthState();
  const [users, setUsers] = useState<User[]>([]);
  const { setNewError, removeError } = useErrorState();
  const [offsetNum, setOffsetNum] = useState(0);
  const [seed, setSeed] = useRecoilState(userListSeed);
  const [isOver, setIsOver] = useState(false);
  const getNew = async (num: number) => {
    if (authState.isLoading || !authState.isLogined) return;
    try {
      const res = await axios.get(`/user?offset=${num}&seed=${seed}`, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      const resUsers: User[] = res.data.user;
      if (resUsers.length === 0) setIsOver(true);
      setUsers(users.concat(resUsers));
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
    setOffsetNum(offsetNum + 100);
    (async () => {
      getNew(offsetNum + 100);
    })();
  };
  return {
    userProfiles: users,
    requestMoreProfiles: requestMoreProfiles,
  };
};
