import { MattermostRegistrationRequest } from "../../interfaces/api";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

export const useMattermostRegister = (): {
  register: (f: MattermostRegistrationRequest) => Promise<{ username: string } | false>;
} => {
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const register = async (f: MattermostRegistrationRequest) => {
    if (!authState.token) return false;
    try {
      const res = await apiClient.POST("/mattermost/create_user", {
        body: f,
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.data) {
        removeError("mattermost-registration-error");
        return res.data;
      }
      return false;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
      setNewError({ message: errMsg, name: "mattermost-registration-error" });
      return false;
    }
  };

  return { register };
};
