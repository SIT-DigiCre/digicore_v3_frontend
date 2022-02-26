import { User } from "../interfaces";
import { useRecoilState } from "recoil";
import { authState } from "../atom/userAtom";
import { useEffect } from "react";
import { axios } from "../utils/axios";

export type AuthState = {
  isLogined: boolean;
  isLoading: boolean;
  user: User | undefined;
  token: string | undefined;
};

type UseAuthState = () => {
  isLogined: boolean;
  isLoading: boolean;
  user: User | undefined;
  token: string | undefined;
  onLogin: (token: string) => void;
};

export const useAuthState: UseAuthState = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const onLogin = (token: string) => {
    axios
      .get("/auth/user", {
        headers: {
          Authorization: token,
        },
      })
      .then((rtn) => {
        const user = rtn.data as User;
        console.log(user);
        setAuth({
          isLogined: true,
          isLoading: false,
          user: user,
          token: token,
        });
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (auth.token) {
      axios
        .get("/auth/checkauth", {
          headers: {
            Authorization: auth.token,
          },
        })
        .then((rtn) => {
          //user情報を取得する
          onLogin(auth.token);
        })
        .catch((err) => {
          //
          setAuth({
            isLogined: false,
            isLoading: false,
            user: auth.user,
            token: undefined,
          });
        });
    } else {
      setAuth({
        isLogined: false,
        isLoading: false,
        user: undefined,
        token: undefined,
      });
    }
  }, []);
  return {
    isLogined: auth.isLogined,
    isLoading: auth.isLoading,
    user: auth.user,
    token: auth.token,
    onLogin: onLogin,
  };
};
