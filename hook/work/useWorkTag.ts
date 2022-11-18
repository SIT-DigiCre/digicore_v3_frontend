import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";
import { axios } from "../../utils/axios";
import { WorkTag, WorkTagDetail } from "../../interfaces/work";

type WorkTagsResponse = {
  tags: WorkTag[];
};

export const useWorkTags = () => {
  const [workTags, setWorkTags] = useState<WorkTag[]>([]);
  const [tagUpdate, setTagUpdate] = useState(0);
  const { setNewError, removeError } = useErrorState();
  const { authState } = useAuthState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get<WorkTagsResponse>("/work/tag", {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        setWorkTags(res.data.tags);
        removeError("work-tag-list-get-fail");
      } catch (err: any) {
        setNewError({ name: "work-tag-list-get-fail", message: "タグ一覧の取得に失敗しました" });
      }
    })();
  }, [authState, tagUpdate]);
  const createTag = (name: string, description: string) => {
    if (name.length === 0) {
      setNewError({ name: "work-tag-create-fail", message: "タグ名を入力してください" });
      return;
    }
    (async () => {
      try {
        await axios.post(
          "/work/tag",
          { name: name, description: description },
          {
            headers: {
              Authorization: "Bearer " + authState.token,
            },
          },
        );
        removeError("work-tag-create-fail");
        setTagUpdate(tagUpdate + 1);
      } catch (err: any) {
        setNewError({ name: "work-tag-create-fail", message: "タグの新規作成に失敗しました" });
      }
    })();
  };
  const deleteTag = (tagId: string) => {
    (async () => {
      try {
        await axios.delete(`/work/tag/${tagId}`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        removeError("work-tag-delete-fail");
        setTagUpdate(tagUpdate + 1);
      } catch (err: any) {
        setNewError({ name: "work-tag-delete-fail", message: "タグの削除に失敗しました" });
      }
    })();
  };
  return { workTags: workTags, createWorkTag: createTag, deleteWorkTag: deleteTag };
};

export const useWorkTagDetail = (tagId: string) => {
  const [workTag, setWorkTag] = useState<WorkTagDetail>();
  const { setNewError, removeError } = useErrorState();
  const { authState } = useAuthState();
  useEffect(() => {
    (async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get<WorkTagDetail>(`/work/tag/${tagId}`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        setWorkTag(res.data);
        removeError("work-tag-detail-get-fail");
      } catch (err: any) {
        setNewError({ name: "work-tag-detail-get-fail", message: "タグの取得に失敗しました" });
      }
    })();
  }, [authState]);
  return workTag ? workTag : null;
};
