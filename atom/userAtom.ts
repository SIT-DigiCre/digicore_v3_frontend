import { atom } from "recoil";
import { AuthState } from "../hook/useAuthState";
import { ErrorState } from "../interfaces";

const DEFAULT_AUTH_STATE: AuthState = {
  isLogined: false,
  isLoading: true,
  user: undefined,
  token: undefined,
};
export const authState = atom<AuthState>({
  key: "user/auth",
  default: DEFAULT_AUTH_STATE,
});

export const errorState = atom<ErrorState[]>({
  key: "sys/error",
  default: [],
});
