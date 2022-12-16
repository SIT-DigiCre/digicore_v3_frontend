import { useRecoilState } from "recoil";
import { authState } from "../atom/userAtom";
import { useEffect } from "react";
import { axios } from "../utils/axios";
import { useErrorState } from "./useErrorState";
import { User } from "../interfaces/user";

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
  const { setNewError, removeError } = useErrorState();
  const getUserInfo = async (token: string): Promise<User> => {
    try {
      const res = await axios.get("/user/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (auth.isLogined) return;
      const user: User = res.data;
      setAuth({
        isLogined: true,
        isLoading: false,
        user: user,
        token: token,
      });
      removeError("autologin-fail");
      return user;
    } catch (e: any) {
      setAuth({ isLogined: false, isLoading: false, user: undefined, token: undefined });
      setNewError({ name: "autologin-fail", message: "ログインしてください" });
    }
    return null;
  };
  const refresh = async () => await getUserInfo(localStorage.getItem("jwt"));
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
    getUserInfo(token);
  };
  useEffect(() => {
    getUserInfo(localStorage.getItem("jwt"));
  }, []);
  return {
    authState: auth,
    onLogin: onLogin,
    logout: logout,
    refresh,
  };
};
