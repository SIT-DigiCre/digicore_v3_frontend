import { axios } from "../utils/axios";
import { useEffect, useState } from "react";
import { useErrorState } from "./useErrorState";

type UseLoginData = () => {
  loginUrl: string;
  setCallbackCode: (string) => Promise<string>;
};

export const useLoginData: UseLoginData = () => {
  const [loginUrl, setLoginUrl] = useState<string>("");
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/login");
        const url: string = res.data.url;
        setLoginUrl(url);
        removeError("get-login-url");
      } catch (e: any) {
        setNewError({ name: "get-login-url", message: "ログイン用URLの取得に失敗しました" });
      }
    })();
  }, []);
  const setCallbackCode = async (code: string): Promise<string> => {
    try {
      const res = await axios.post("/login/callback", { code: code });
      const jwt: string = res.data.jwt;
      return jwt;
    } catch (e: any) {
      return "";
    }
  };
  return {
    loginUrl,
    setCallbackCode,
  };
};
