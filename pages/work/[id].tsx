import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { Avatar, Box, IconButton, Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import ChipList from "../../components/Common/ChipList";
import Heading from "../../components/Common/Heading";
import { IconButtonLink } from "../../components/Common/IconButtonLink";
import PageHead from "../../components/Common/PageHead";
import MarkdownView from "../../components/Markdown/MarkdownView";
import WorkEditor from "../../components/Work/WorkEditor";
import { WorkFileView } from "../../components/Work/WorkFileView";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { WorkRequest } from "../../interfaces/work";
import { apiClient, createServerApiClient } from "../../utils/fetch/client";

type WorkPublicAuthor = {
  userId: string;
  username: string;
  iconUrl: string;
};

type WorkPublicTag = {
  tagId: string;
  name: string;
};

type WorkPublic = {
  workId: string;
  name: string;
  description: string;
  authors: WorkPublicAuthor[];
  fileUrl: string;
  fileName: string;
  tags: WorkPublicTag[];
};

export const getServerSideProps = async ({ params, query, req }: GetServerSidePropsContext) => {
  try {
    const id = params?.id;
    if (!id || typeof id !== "string") {
      return { notFound: true };
    }

    const { mode } = query;
    const modeStr = typeof mode === "string" ? mode : null;

    const client = createServerApiClient(req);

    let workDetail = null;
    let workPublic: WorkPublic | undefined = undefined;

    const detailRes = await client.GET("/work/work/{workId}", {
      params: {
        path: {
          workId: id,
        },
      },
    });
    if (detailRes.data) {
      workDetail = detailRes.data;
    }

    const publicRes = await client.GET("/work/work/{workId}/public", {
      params: {
        path: {
          workId: id,
        },
      },
    });
    if (publicRes.data) {
      workPublic = publicRes.data as WorkPublic;
      if (workPublic.description) {
        workPublic.description = workPublic.description.substring(0, 100);
      }
    }

    if (!workDetail && !workPublic) {
      return { notFound: true };
    }

    const tagsRes = await client.GET("/work/tag");
    const tags = tagsRes.data?.tags || [];

    return {
      props: {
        id,
        modeStr,
        tags,
        workDetail,
        workPublic,
      },
    };
  } catch {
    return { notFound: true };
  }
};

type WorkDetailPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const WorkDetailPage = ({ id, modeStr, workDetail, workPublic, tags }: WorkDetailPageProps) => {
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const router = useRouter();

  if (!authState.isLogined && workPublic) {
    return (
      <Head>
        <meta property="og:title" content={workPublic.name} />
        <meta
          property="og:description"
          content={workPublic.authors.map((a) => a.username).join(", ")}
        />
        <meta property="og:url" content={`https://core3.digicre.net/work/${workPublic.workId}`} />
        <meta property="og:image" content="https://core3.digicre.net/image/digicore.png" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="デジコア" />
        <meta name="twitter:title" content={workPublic.name} />
        <meta
          name="twitter:description"
          content={workPublic.authors.map((a) => a.username).join(", ")}
        />
        <meta name="twitter:image" content="https://core3.digicre.net/image/digicore.png" />
        <meta name="twitter:card" content="summary" />
      </Head>
    );
  }

  if (!authState.isLogined || !authState.user || !workDetail) {
    return <p>読み込み中...</p>;
  }

  const onSubmit = async (workRequest: WorkRequest) => {
    if (!authState.token) {
      setNewError({ message: "ログインしてください", name: "work-put-fail" });
      return;
    }

    try {
      await apiClient.PUT("/work/work/{workId}", {
        body: workRequest,
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          path: {
            workId: id,
          },
        },
      });
      removeError("work-put-fail");
      router.reload();
    } catch {
      setNewError({ message: "Workの更新に失敗しました", name: "work-put-fail" });
    }
  };

  const onClickDelete = async () => {
    if (!authState.token) {
      setNewError({ message: "ログインしてください", name: "work-delete-fail" });
      return;
    }

    const res = window.confirm(`${workDetail.name}を本当に削除しますか？`);
    if (!res) return;

    try {
      await apiClient.DELETE("/work/work/{workId}", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          path: {
            workId: id,
          },
        },
      });
      removeError("work-delete-fail");
      router.push(`/work`);
    } catch {
      setNewError({ message: "Workの削除に失敗しました", name: "work-delete-fail" });
    }
  };

  return (
    <>
      <PageHead title={workDetail.name} />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<ArrowBack />} variant="text">
          作品一覧に戻る
        </ButtonLink>
        {workDetail.authors.some((a) => a.userId === authState.user?.userId) && (
          <Stack direction="row" spacing={1}>
            {modeStr !== "edit" && (
              <IconButtonLink href={`/work/${id}?mode=edit`} ariaLabel="編集する">
                <Edit />
              </IconButtonLink>
            )}
            <IconButton aria-label="削除する" onClick={onClickDelete}>
              <Delete />
            </IconButton>
          </Stack>
        )}
      </Stack>
      {modeStr === "edit" ? (
        <WorkEditor onSubmit={onSubmit} initWork={workDetail} workTags={tags} />
      ) : (
        <Stack direction="column" spacing={2} my={2}>
          <Box>
            <Heading level={3}>作者</Heading>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {workDetail.authors &&
                workDetail.authors.map((a) => (
                  <ButtonLink
                    startIcon={<Avatar src={a.iconUrl} className="d-inlineblock" />}
                    href={`/member/${a.userId}`}
                    key={a.userId}
                    variant="text"
                  >
                    {a.username}
                  </ButtonLink>
                ))}
            </Stack>
          </Box>
          {workDetail.tags && (
            <Box>
              <Heading level={3}>タグ</Heading>
              <ChipList chipList={workDetail.tags.map((t) => t.name)} />
            </Box>
          )}
          {workDetail.description && (
            <Box>
              <Heading level={3}>作品説明</Heading>
              <MarkdownView md={workDetail.description} />
            </Box>
          )}
          {workDetail.files && workDetail.files.length > 0 && (
            <Box>
              <Heading level={3}>ファイル</Heading>
              {workDetail.files.map((f) => (
                <WorkFileView key={f.fileId} fileId={f.fileId} />
              ))}
            </Box>
          )}
        </Stack>
      )}
    </>
  );
};

export default WorkDetailPage;
