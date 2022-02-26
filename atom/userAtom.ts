import { atom } from "recoil";
import { AuthState, DEFAULT_AUTH_STATE } from "../hook/useAuthState";

export const authState = atom<AuthState>({
  key: "user/auth",
  default: DEFAULT_AUTH_STATE,
});
