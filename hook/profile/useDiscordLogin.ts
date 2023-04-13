import { axios } from "../../utils/axios";
import { useEffect, useState } from "react";
import { useErrorState } from "../useErrorState";
import { useAuthState } from "../useAuthState";

type UseDiscordLogin = () => {
  loginUrl: string;
  setCallbackCode: (string) => Promise<void>;
};

export const useDiscordLogin: UseDiscordLogin = () => {
  const [loginUrl, setLoginUrl] = useState<string>("");
  const { setNewError, removeError } = useErrorState();
  const { authState } = useAuthState();
  useEffect(() => {
    if (!authState.isLogined) return;
    (async () => {
      try {
        const res = await axios.get("/user/me/discord", {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const url: string = res.data.url;
        setLoginUrl(url);
        removeError("get-discord-login-url");
      } catch (e: any) {
        setNewError({
          name: "get-discord-login-url",
          message: "Discordログイン用URLの取得に失敗しました",
        });
      }
    })();
  }, [authState]);
  const setCallbackCode = async (code: string): Promise<void> => {
    const _ = await axios.put(
      "/user/me/discord/callback",
      { code: code },
      {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      },
    );
  };
  return {
    loginUrl,
    setCallbackCode,
  };
};
