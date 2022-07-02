import { User } from "../interfaces";
import { useRecoilState } from "recoil";
import { authState } from "../atom/userAtom";
import { useEffect } from "react";
import { axios } from "../utils/axios";
import { UserProfileAPIDataResponse, convertUserFromUserProfile } from "../interfaces/api";
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
  const { setNewError } = useErrorState();
  const getUserInfo = (token: string) => {
    axios
      .get("/user/my", {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        const userProfileAPIDataResponse: UserProfileAPIDataResponse = res.data;
        setAuth({
          isLogined: true,
          isLoading: false,
          user: convertUserFromUserProfile(userProfileAPIDataResponse),
          token: token,
        });
      })
      .catch((err) => {
        setAuth({ isLogined: false, isLoading: false, user: undefined, token: undefined });
        setNewError({ name: "login-fail", message: "ログインしてください" });
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
