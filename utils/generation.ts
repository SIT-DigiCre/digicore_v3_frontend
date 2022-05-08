import { authState } from "../atom/userAtom";
import { AuthState } from "../hook/useAuthState";
import { GroupsAPIData } from "../interfaces/api";
import { axios } from "./axios";

export const getLatestGeneration = async (authState: AuthState) => {
  const res = await axios.get("/group", {
    headers: {
      Authorization: "bearer " + authState.token,
    },
  });
  const groupsApiData: GroupsAPIData = res.data;
  const generations = groupsApiData.groups
    .filter((g) => /\d\dth/.test(g.name))
    .sort((g) => parseInt(g.name.substring(0, 2)));

  return generations[generations.length - 1];
};

export const postLatestGeneration = async (authState: AuthState) => {
  const targetId = (await getLatestGeneration(authState)).id;
  return axios.post(
    `/group/${targetId}`,
    {},
    {
      headers: {
        Authorization: "bearer " + authState.token,
      },
    },
  );
};
