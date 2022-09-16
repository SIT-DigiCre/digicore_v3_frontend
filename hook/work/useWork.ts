import axios from "axios";
import { useEffect, useState } from "react";
import { Work, WorkDetail } from "../../interfaces/work";
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
        const res = await axios.get(`/work/${workId}`, {
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
  createWork: () => Promise<string>;
};

export const useWorks: UseWorks = () => {
  const [works, setWorks] = useState<Work[]>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/work`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const workDetail: WorkDetail = res.data;
        removeError("workdetail-get-fail");
      } catch (e: any) {
        setNewError({ name: "workdetail-get-fail", message: "ファイルの取得に失敗しました" });
      }
    })();
  }, [authState]);
  const loadMore = () => {};
  const createWork = async (): Promise<string> => {
    return "";
  };
  return {
    works: works,
    loadMore: loadMore,
    createWork: createWork,
  };
};
