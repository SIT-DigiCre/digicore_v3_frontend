import { useState } from "react";
import { UserProfile } from "../../interfaces/user";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

export const useUserSearch = () => {
  const { authState } = useAuthState();
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const { setNewError, removeError } = useErrorState();

  const searchUsers = async (query: string) => {
    if (authState.isLoading || !authState.isLogined) return;
    if (query.length < 1 || query.length > 10) return;
    try {
      const { data } = await apiClient.GET("/user/search", {
        params: {
          query: { query },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setSearchResults(data.users);
    } catch (error) {
      setNewError({ name: "user-search-fail", message: "ユーザー検索に失敗しました" });
    }
  };

  return { searchResults, searchUsers };
};
