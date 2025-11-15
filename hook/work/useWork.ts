import { useEffect, useState } from "react";

import { axios } from "../../utils/axios";
import { apiClient } from "../../utils/fetch/client";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

import type { Work, WorkDetail, WorkRequest } from "../../interfaces/work";

type UseWork = (workId: string) => {
  workDetail: WorkDetail;
  updateWork: (workRequest: WorkRequest) => Promise<boolean>;
  deleteWork: () => Promise<boolean>;
};

export const useWork: UseWork = (workId) => {
  const [work, setWork] = useState<WorkDetail>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const { data } = await apiClient.GET("/work/work/{workId}", {
          params: {
            path: {
              workId,
            },
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setWork(data);
        removeError("workdetail-get-fail");
      } catch {
        setNewError({ name: "workdetail-get-fail", message: "Workの取得に失敗しました" });
      }
    })();
  }, [authState]);

  const updateWork = async (updatedWork: WorkRequest) => {
    try {
      await apiClient.PUT("/work/work/{workId}", {
        params: {
          path: {
            workId,
          },
        },
        body: updatedWork,
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      removeError("work-put-fail");
      return true;
    } catch {
      setNewError({ name: "work-put-fail", message: "Workの更新に失敗しました" });
      return false;
    }
  };

  const deleteWork = async () => {
    try {
      await apiClient.DELETE("/work/work/{workId}", {
        params: {
          path: {
            workId,
          },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      removeError("work-delete-fail");
      return true;
    } catch {
      setNewError({ name: "work-delete-fail", message: "Workの削除に失敗しました" });
      return false;
    }
  };

  return {
    workDetail: work,
    updateWork,
    deleteWork,
  };
};

// autherIdを指定すると指定したユーザーIDのWorkを取得する
// autherIdに"my"を指定すると自ユーザーのWorkを取得する
// autherIdに何も入れないと全ユーザーのWorkを取得する
type UseWorks = (authorId?: string | "my") => {
  works: Work[];
  loadMore: () => void;
  createWork: (workRequest: WorkRequest) => Promise<string>;
  deleteWork: (id: string) => Promise<boolean>;
};

export const useWorks: UseWorks = (authorId) => {
  const [works, setWorks] = useState<Omit<WorkDetail, "description" | "files">[]>([]);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [offsetNum, setOffsetNum] = useState(0);

  const loadWork = async (n: number) => {
    if (!authState.isLogined) return;
    try {
      const { data } = await apiClient.GET("/work/work", {
        params: {
          query: {
            offset: n,
            authorId: authorId
              ? authorId === "my"
                ? authState.user.userId!
                : authorId
              : undefined,
          },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setWorks(data.works);
      removeError("works-get-fail");
      setOffsetNum(n);
    } catch {
      setNewError({ name: "works-get-fail", message: "Workの一覧の取得に失敗しました" });
    }
  };

  useEffect(() => {
    loadWork(0);
  }, [authState]);

  const loadMore = () => {
    loadWork(offsetNum + 10);
  };

  const createWork = async (workRequest: WorkRequest): Promise<string> => {
    if (!authState.isLogined) return "ログインしてください";
    try {
      const res = await axios.post(`/work/work`, workRequest, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      removeError("work-post-fail");
      return res.data.workId;
    } catch {
      setNewError({ name: "work-post-fail", message: "Workの投稿に失敗しました" });
      return "error";
    }
  };

  const deleteWork = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`/work/work/${id}`, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      removeError("work-delete-fail");
      return true;
    } catch {
      setNewError({ name: "work-delete-fail", message: "Workの削除に失敗しました" });
      return false;
    }
  };

  return {
    works: works,
    loadMore: loadMore,
    createWork: createWork,
    deleteWork: deleteWork,
  };
};
