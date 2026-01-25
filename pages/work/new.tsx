import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { ArrowBack } from "@mui/icons-material";
import { Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import WorkEditor from "../../components/Work/WorkEditor";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { WorkRequest } from "../../interfaces/work";
import { apiClient, createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);

  try {
    const tagsRes = await client.GET("/work/tag");
    const tags = tagsRes.data?.tags || [];

    return {
      props: {
        tags,
      },
    };
  } catch {
    return {
      props: {
        tags: [],
      },
    };
  }
};

const WorkCreatePage = ({
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();

  const onSubmit = async (workRequest: WorkRequest) => {
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "work-post-fail", message: "ログインしてください" });
      return;
    }

    try {
      const res = await apiClient.POST("/work/work", {
        body: workRequest,
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (!res.data || !res.data.workId) {
        setNewError({ name: "work-post-fail", message: "Workの投稿に失敗しました" });
        return;
      }

      removeError("work-post-fail");
      router.push(`/work/${res.data.workId}`);
    } catch {
      setNewError({ name: "work-post-fail", message: "Workの投稿に失敗しました" });
    }
  };

  return (
    <>
      <PageHead title="作品を投稿する" />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<ArrowBack />} variant="text">
          作品一覧に戻る
        </ButtonLink>
      </Stack>
      <WorkEditor onSubmit={onSubmit} initialTags={tags} />
    </>
  );
};

export default WorkCreatePage;
