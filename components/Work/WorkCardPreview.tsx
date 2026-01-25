import { useEffect, useState } from "react";

import { useAuthState } from "../../hook/useAuthState";
import { WorkDetail } from "../../interfaces/work";
import { apiClient } from "../../utils/fetch/client";
import MarkdownView from "../Markdown/MarkdownView";

import { WorkFileView } from "./WorkFileView";

type Props = {
  id: string;
};

export const WorkCardPreview = ({ id }: Props) => {
  const { authState } = useAuthState();
  const [workDetail, setWorkDetail] = useState<WorkDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authState.isLogined || !authState.token) return;

    let isMounted = true;

    (async () => {
      try {
        const res = await apiClient.GET("/work/work/{workId}", {
          params: {
            path: {
              workId: id,
            },
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        if (!isMounted) return;
        if (res.data) {
          setWorkDetail(res.data);
        } else if (res.error) {
          setError("作品の取得に失敗しました");
        }
      } catch {
        if (isMounted) {
          setError("作品の取得に失敗しました");
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, authState.isLogined, authState.token]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!workDetail) {
    return <p>読み込み中...</p>;
  }

  if (!workDetail.files || workDetail.files.length === 0) {
    return <MarkdownView md={workDetail.description.substring(0, 120)} />;
  }

  return <WorkFileView fileId={workDetail.files[0].fileId} />;
};
