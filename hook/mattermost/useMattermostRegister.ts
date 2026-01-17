import { MattermostRegistrationRequest } from "../../interfaces/api";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

export const useMattermostRegister = (): {
  register: (f: MattermostRegistrationRequest) => Promise<{ username: string } | false>;
} => {
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const register = async (f: MattermostRegistrationRequest) => {
    try {
      const res = await axios.post("/mattermost/create_user", f, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      removeError("mattermost-registration-error");
      return res.data;
    } catch (err: unknown) {
      let errMsg = "";
      if (err instanceof Error) {
        errMsg = err.message;
      } else {
        errMsg = err instanceof Error ? err.message : "An unknown error occurred";
      }
      setNewError({ name: "mattermost-registration-error", message: errMsg });
      return false;
    }
  };
  return { register };
};
