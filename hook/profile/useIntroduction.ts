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
        const res = await axios.get(`/user/my/introduction`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const userIntroductionAPIDataResponse: {
          self_introduction?: { self_introduction: string };
          error?: string;
        } = res.data;
        if (userIntroductionAPIDataResponse.self_introduction) {
          setMd(userIntroductionAPIDataResponse.self_introduction.self_introduction);
          removeError("introduction-get-fail");
        } else {
          throw "API Error";
        }
      } catch (err: any) {
        setNewError({ name: "introduction-get-fail", message: "自己紹介情報の取得に失敗しました" });
      }
    })();
  }, [authState]);
  const update = async (newMd: string) => {
    try {
      const res = await axios.put(
        `/user/my/introduction`,
        { self_introduction: newMd },
        {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        },
      );
      setMd(newMd);
      removeError("introduction-update-fail");
      return true;
    } catch (err: any) {
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
            Authorization: "bearer " + authState.token,
          },
        });
        const userIntroductionAPIDataResponse: {
          self_introduction?: { self_introduction: string };
          error?: string;
        } = res.data;
        if (userIntroductionAPIDataResponse.self_introduction) {
          setMd(userIntroductionAPIDataResponse.self_introduction.self_introduction);
          removeError("introduction-get-fail");
        } else {
          throw "API Error";
        }
      } catch (err: any) {
        setNewError({ name: "introduction-get-fail", message: "自己紹介情報の取得に失敗しました" });
      }
    })();
  }, [authState]);
  return md;
};
