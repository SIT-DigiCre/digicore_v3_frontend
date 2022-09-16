import axios from "axios";
import { useEffect, useState } from "react";
import { Work, WorkDetail, WorkRequest } from "../../interfaces/work";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseWork = (workId: string) => WorkDetail;
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
  return work;
};

type UseWorks = () => {
  works: Work[];
  loadMore: () => void;
  createWork: (workRequest: WorkRequest) => Promise<string>;
};

export const useWorks: UseWorks = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [pageNum, setPageNum] = useState(0);
  const loadWork = async (n: number) => {
    if (!authState.isLogined) return;
    try {
      const res = await axios.get(`/work/work?pages=${n}`, {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      const newWorks: Work[] = res.data.works;
      setWorks(works.concat(newWorks));
      removeError("works-get-fail");
      setPageNum(n);
    } catch (e: any) {
      setNewError({ name: "works-get-fail", message: "Workの一覧の取得に失敗しました" });
    }
  };
  useEffect(() => {
    loadWork(pageNum + 1);
  }, [authState]);
  const loadMore = () => {
    loadWork(pageNum + 1);
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
    } catch (e: any) {
      setNewError({ name: "work-post-fail", message: "Workの投稿に失敗しました" });
    }
    return "";
  };
  return {
    works: works,
    loadMore: loadMore,
    createWork: createWork,
  };
};
