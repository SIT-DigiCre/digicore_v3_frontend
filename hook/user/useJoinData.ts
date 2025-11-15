import { useEffect, useState } from "react";

import { EnvJoinAPIData } from "../../interfaces/api";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

export const useJoinData = () => {
  const { authState } = useAuthState();
  const [joinData, setJoinData] = useState<EnvJoinAPIData>();
  const { setNewError } = useErrorState();
  useEffect(() => {
    if (authState.isLoading || !authState.isLogined) return;
    if (authState.user.discordUserId === "") {
      setNewError({
        name: "no-register",
        message: "Discordの登録が正常に済んでいません。登録が完了していることを確認してください。",
      });
      return;
    }
    (async () => {
      try {
        const res = await axios.get("/tool", {
          headers: { Authorization: "Bearer " + authState.token },
        });
        const envJoinAPIData: EnvJoinAPIData = res.data;
        setJoinData(envJoinAPIData);
      } catch {
        setNewError({ name: "get-join", message: "Discordなどの招待URLの取得に失敗しました" });
      }
    })();
  }, [authState]);
  return joinData;
};
