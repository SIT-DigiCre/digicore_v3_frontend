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
  refresh: () => Promise<User | null>;
};

export const useAuthState: UseAuthState = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const { removeError } = useErrorState();
  const router = useRouter();
  const isPublicPage =
    router.pathname.startsWith("/login") || router.pathname.startsWith("/signup");

  const getUserInfo = async (token: string, refresh: boolean): Promise<User | null> => {
    try {
      const res = await axios.get("/user/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (auth.isLogined && !refresh) return null;
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
      if (!isPublicPage) {
        setAuth({ isLogined: false, isLoading: false, user: undefined, token: undefined });
        router.push("/login");
      }
    }
    return null;
  };

  const refresh = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null;
    return await getUserInfo(token, true);
  };

  const logout = () => {
    setAuth({
      isLogined: false,
      isLoading: false,
      user: undefined,
      token: undefined,
    });
    localStorage.removeItem("jwt");
    document.cookie = "jwt=; path=/; max-age=0";
    router.push("/login");
  };

  const onLogin = (token: string) => {
    localStorage.setItem("jwt", token);
    const maxAge = 60 * 60 * 24 * 7; // 7日間
    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";
    document.cookie = `jwt=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    getUserInfo(token, true);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    getUserInfo(token, false);
  }, []);

  return {
    authState: auth,
    onLogin: onLogin,
    logout: logout,
    refresh,
  };
};
