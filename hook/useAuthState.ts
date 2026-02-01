import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { User } from "../interfaces/user";
import { apiClient } from "../utils/fetch/client";
import { useErrorState } from "./useErrorState";

export type AuthState = {
  isLogined: boolean;
  isLoading: boolean;
  user: User | undefined;
  token: string | undefined;
};

const DEFAULT_AUTH_STATE: AuthState = {
  isLoading: true,
  isLogined: false,
  token: undefined,
  user: undefined,
};

type UseAuthState = () => {
  authState: AuthState;
  onLogin: (token: string) => void;
  logout: () => void;
  refresh: () => Promise<User | null>;
};

export const useAuthState: UseAuthState = () => {
  const [auth, setAuth] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const { removeError } = useErrorState();
  const router = useRouter();
  const isPublicPage =
    router.pathname.startsWith("/login") || router.pathname.startsWith("/signup");

  const getUserInfo = async (token: string, forceRefresh: boolean): Promise<User | null> => {
    try {
      const res = await apiClient.GET("/user/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.data) throw new Error("No data");
      setAuth((prev) => {
        if (prev.isLogined && !forceRefresh) return prev;
        return {
          isLoading: false,
          isLogined: true,
          token,
          user: res.data,
        };
      });
      removeError("autologin-fail");
      return res.data;
    } catch {
      if (!isPublicPage) {
        setAuth({ isLoading: false, isLogined: false, token: undefined, user: undefined });
        router.push("/login");
      }
    }
    return null;
  };

  const getToken = (): string | null => {
    if (typeof document === "undefined") return null;
    const jwtCookie = document.cookie.split("; ").find((row) => row.startsWith("jwt="));
    return jwtCookie ? jwtCookie.replace(/^jwt=/, "") : null;
  };

  const refresh = async () => {
    const token = getToken();
    if (!token) return null;
    return await getUserInfo(token, true);
  };

  const logout = () => {
    setAuth({
      isLoading: false,
      isLogined: false,
      token: undefined,
      user: undefined,
    });
    document.cookie = "jwt=; path=/; max-age=0";
    router.push("/login");
  };

  const onLogin = (token: string) => {
    const maxAge = 60 * 60 * 24 * 7; // 7日間
    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";
    document.cookie = `jwt=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    getUserInfo(token, true);
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuth((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    getUserInfo(token, false);
  }, []);

  return {
    authState: auth,
    logout,
    onLogin,
    refresh,
  };
};
