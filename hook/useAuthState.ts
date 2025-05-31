import { useRouter } from "next/router";
import { useEffect } from "react";

import { useRecoilState } from "recoil";

import { authState } from "../atom/userAtom";
import { User } from "../interfaces/user";
import { axios } from "../utils/axios";

import { useErrorState } from "./useErrorState";

export type AuthState = {
  isLogined: boolean;
  isLoading: boolean;
  user: User | undefined;
  token: string | undefined;
};

type UseAuthState = () => {
  authState: AuthState;
  onLogin: (token: string) => void;
  logout: () => void;
  refresh: () => Promise<User>;
};

export const useAuthState: UseAuthState = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const { removeError } = useErrorState();
  const router = useRouter();

  const getUserInfo = async (token: string, refresh: boolean): Promise<User> => {
    try {
      const res = await axios.get("/user/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (auth.isLogined && !refresh) return;
      const user: User = res.data;
      setAuth({
        isLogined: true,
        isLoading: false,
        user: user,
        token: token,
      });
      removeError("autologin-fail");
      return user;
    } catch {
      setAuth({ isLogined: false, isLoading: false, user: undefined, token: undefined });
      router.push("/login");
    }
    return null;
  };

  const refresh = async () => await getUserInfo(localStorage.getItem("jwt"), true);
  // ローカルストレージを削除する関数
  const logout = () => {
    setAuth({
      isLogined: false,
      isLoading: false,
      user: undefined,
      token: undefined,
    });
    localStorage.removeItem("jwt");
  };

  const onLogin = (token: string) => {
    localStorage.setItem("jwt", token);
    getUserInfo(token, true);
  };

  useEffect(() => {
    getUserInfo(localStorage.getItem("jwt"), false);
  }, []);

  return {
    authState: auth,
    onLogin: onLogin,
    logout: logout,
    refresh,
  };
};
