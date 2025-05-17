import { useEffect, useState } from "react";

import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseMyIntroduction = () => [
  introduction: string,
  updateIntroduction: (md: string) => Promise<boolean>,
];
export const useMyIntroduction: UseMyIntroduction = () => {
  const [md, setMd] = useState<string>("");
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/me/introduction`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const intro: string = res.data.introduction;
        if (intro) {
          setMd(intro);
          removeError("introduction-get-fail");
        } else {
          throw "API Error";
        }
      } catch {
        setNewError({ name: "introduction-get-fail", message: "自己紹介情報の取得に失敗しました" });
      }
    })();
  }, [authState]);
  const update = async (newMd: string) => {
    try {
      await axios.put(
        `/user/me/introduction`,
        { introduction: newMd },
        {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        },
      );
      setMd(newMd);
      removeError("introduction-update-fail");
      return true;
    } catch {
      setNewError({
        name: "introduction-update-fail",
        message: "自己紹介情報の更新に失敗しました",
      });
      return false;
    }
  };
  return [md, update];
};

type UseIntroduction = (userId: string) => string;

export const useIntroduction: UseIntroduction = (userId) => {
  const [md, setMd] = useState<string>("");
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/user/${userId}/introduction`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const userIntroduction: string = res.data.introduction;
        setMd(userIntroduction);
        removeError("introduction-get-fail");
      } catch {
        setNewError({
          name: "introduction-get-fail",
          message: "自己紹介情報の取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  return md;
};
