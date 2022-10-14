import { axios } from "../../utils/axios";
import { useEffect, useState } from "react";
import { Work, WorkDetail, WorkRequest } from "../../interfaces/work";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

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
        const res = await axios.get(`/work/work/${workId}`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const workDetail: WorkDetail = res.data;
        setWork(workDetail);
        removeError("workdetail-get-fail");
      } catch (e: any) {
        setNewError({ name: "workdetail-get-fail", message: "Workの取得に失敗しました" });
      }
    })();
  }, [authState]);
  const updateWork = async (workRequest: WorkRequest): Promise<boolean> => {
    try {
      const res = await axios.put(`/work/work/${workId}`, workRequest, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      removeError("work-put-fail");
      return true;
    } catch (e: any) {
      setNewError({ name: "work-put-fail", message: "Workの更新に失敗しました" });
      return false;
    }
  };
  const deleteWork = async (): Promise<boolean> => {
    try {
      const res = await axios.delete(`/work/work/${workId}`, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      removeError("work-delete-fail");
      return true;
    } catch (e: any) {
      setNewError({ name: "work-delete-fail", message: "Workの削除に失敗しました" });
      return false;
    }
  };
  return { workDetail: work, updateWork, deleteWork };
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
  const [works, setWorks] = useState<Work[]>([]);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [pageNum, setPageNum] = useState(0);
  const loadWork = async (n: number) => {
    if (!authState.isLogined) return;
    try {
      const res = await axios.get(
        `/work/work/?pages=${n}${
          authorId
            ? authorId === "my"
              ? `&auther_id=${authState.user.id!}`
              : `&auther_id=${authorId}`
            : ""
        }`,
        {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        },
      );
      const newWorks: Work[] = res.data.works;
      setWorks(works.concat(newWorks));
      removeError("works-get-fail");
      setPageNum(n);
    } catch (e: any) {
      setNewError({ name: "works-get-fail", message: "Workの一覧の取得に失敗しました" });
    }
  };
  useEffect(() => {
    loadWork(0);
  }, [authState]);
  const loadMore = () => {
    loadWork(pageNum + 100);
  };
  const createWork = async (workRequest: WorkRequest): Promise<string> => {
    if (!authState.isLogined) return "ログインしてください";
    try {
      const res = await axios.post(`/work/work`, workRequest, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      removeError("work-post-fail");
      return res.data.id;
    } catch (e: any) {
      setNewError({ name: "work-post-fail", message: "Workの投稿に失敗しました" });
      return "error";
    }
  };
  const deleteWork = async (id: string): Promise<boolean> => {
    try {
      const res = await axios.delete(`/work/work/${id}`, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      removeError("work-delete-fail");
      return true;
    } catch (e: any) {
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
