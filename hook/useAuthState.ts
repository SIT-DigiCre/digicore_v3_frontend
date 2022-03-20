import { User } from "../interfaces";
import { useRecoilState } from "recoil";
import { authState } from "../atom/userAtom";
import { useEffect } from "react";
import { axios } from "../utils/axios";

export type AuthState = {
  isLogined: boolean;
  isLoading: boolean;
  user: User | undefined;
};

type UseAuthState = () => {
  authState: AuthState;
  onLogin: () => void;
};

export const useAuthState: UseAuthState = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const getUserInfo = () => {
    axios
      .get("/user/my")
      .then((res) => {
        setAuth({
          isLogined: true,
          isLoading: false,
          user: undefined, //あとで変更する
        });
      })
      .catch((err) => {
        setAuth({ isLogined: false, isLoading: false, user: undefined });
      });
  };
  const onLogin = () => {
    getUserInfo();
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return {
    authState: auth,
    onLogin: onLogin,
  };
};
