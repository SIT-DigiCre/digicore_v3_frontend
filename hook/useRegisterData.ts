import { useEffect, useState } from "react";

import { axios } from "../utils/axios";

import { useErrorState } from "./useErrorState";

type UseRegisterData = () => {
  registerUrl: string;
  setCallbackCode: (string) => Promise<string>;
};

export const useRegisterData: UseRegisterData = () => {
  const [registerUrl, setRegisterUrl] = useState<string>("");
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/signup");
        const url: string = res.data.url;
        setRegisterUrl(url);
        removeError("get-register-url");
      } catch {
        setNewError({ name: "get-register-url", message: "登録用URLの取得に失敗しました" });
      }
    })();
  }, []);
  const setCallbackCode = async (code: string): Promise<string> => {
    try {
      const res = await axios.post("/signup/callback", { code: code });
      const jwt: string = res.data.jwt;
      return jwt;
    } catch {
      return "";
    }
  };
  return {
    registerUrl,
    setCallbackCode,
  };
};
