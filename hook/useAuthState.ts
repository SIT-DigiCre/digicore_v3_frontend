import { User } from "../interfaces";
import { useRecoilState } from "recoil";
import { authState } from "../atom/userAtom";
import { useEffect } from "react";
import { axios } from "../utils/axios";
import { convertUserFromUserProfile, UserProfileAPIData } from "../interfaces/api";
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
};

export const useAuthState: UseAuthState = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const { setNewError, removeError } = useErrorState();
  const getUserInfo = (token: string) => {
    axios
      .get("/user/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (auth.isLogined) return;
        const userProfileAPIData: UserProfileAPIData = res.data;
        setAuth({
          isLogined: true,
          isLoading: false,
          user: convertUserFromUserProfile(userProfileAPIData),
          token: token,
        });
        removeError("autologin-fail");
      })
      .catch((err) => {
        setAuth({ isLogined: false, isLoading: false, user: undefined, token: undefined });
        setNewError({ name: "autologin-fail", message: "ログインしてください" });
      });
  };
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
  };
};
