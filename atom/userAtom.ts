import { atom } from "recoil";

import { AuthState } from "../hook/useAuthState";
import { DarkMode, ErrorState } from "../interfaces";

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

export const darkModeState = atom<DarkMode>({
  key: "sys/darkmode",
  default: "os",
});

export const userListSeed = atom<number>({
  key: "seed/userList",
  default: Math.floor(Math.random() * 100),
});
