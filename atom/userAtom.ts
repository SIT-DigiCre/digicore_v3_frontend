import { atom } from "recoil";
import { AuthState } from "../hook/useAuthState";

const DEFAULT_AUTH_STATE: AuthState = {
  isLogined: false,
  isLoading: true,
  user: undefined,
};
export const authState = atom<AuthState>({
  key: "user/auth",
  default: DEFAULT_AUTH_STATE,
});
