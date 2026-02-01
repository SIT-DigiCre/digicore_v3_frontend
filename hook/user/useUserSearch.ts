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
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          query: { query },
        },
      });
      if (!data) {
        setNewError({ message: "ユーザー検索に失敗しました", name: "user-search-fail" });
        return;
      }
      setSearchResults(data.users);
      removeError("user-search-fail");
    } catch {
      setNewError({ message: "ユーザー検索に失敗しました", name: "user-search-fail" });
    }
  };

  return { searchResults, searchUsers };
};
