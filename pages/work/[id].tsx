import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { Avatar, Box, Button, Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import ChipList from "../../components/Common/ChipList";
import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import MarkdownView from "../../components/Markdown/MarkdownView";
import WorkEditor from "../../components/Work/WorkEditor";
import { WorkFileView } from "../../components/Work/WorkFileView";
import { useAuthState } from "../../hook/useAuthState";
import { useWork } from "../../hook/work/useWork";
import { WorkRequest } from "../../interfaces/work";
import { isAxiosError, serverSideAxios } from "../../utils/axios";

type WorkDetailPageProps = {
  id: string;
  modeStr?: string;
  workPublic?: WorkPublic;
};

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

const WorkDetailPage = ({ id, modeStr, workPublic }: WorkDetailPageProps) => {
  const { workDetail, updateWork, deleteWork } = useWork(id);
  const { authState } = useAuthState();
  const router = useRouter();

  const onSubmit = (workRequest: WorkRequest) => {
    updateWork(workRequest).then((result) => {
      if (!result) return;
      router.push(`/work/${id}`);
    });
  };

  const onClickEdit = () => {
    router.push(`/work/${id}?mode=edit`);
  };

  const onClickDelete = async () => {
    const res = window.confirm(`${workDetail.name}を本当に削除しますか？`);
    if (res) {
      await deleteWork();
      router.push(`/work`);
    }
  };

  if (!authState.isLogined) {
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

  if (!workDetail) return <p>読み込み中...</p>;

  return (
    <>
      <PageHead title={workDetail.name} />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<ArrowBack />} variant="text">
          作品一覧に戻る
        </ButtonLink>
        {workDetail.authors.map((a) => a.userId).includes(authState.user.userId) && (
          <Stack direction="row" spacing={2}>
            {modeStr !== "edit" && (
              <Button
                variant="contained"
                color="primary"
                onClick={onClickEdit}
                startIcon={<Edit />}
              >
                編集する
              </Button>
            )}
            <Button
              variant="contained"
              color="error"
              onClick={onClickDelete}
              startIcon={<Delete />}
            >
              削除する
            </Button>
          </Stack>
        )}
      </Stack>
      {modeStr === "edit" ? (
        <WorkEditor onSubmit={onSubmit} initWork={workDetail} />
      ) : (
        <Stack direction="column" spacing={2} my={2}>
          <Box>
            <Heading level={3}>作者</Heading>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {workDetail.authors &&
                workDetail.authors.map((a) => (
                  <ButtonLink
                    startIcon={<Avatar src={a.iconUrl} className="d-inlineblock" />}
                    href={`/user/${a.userId}`}
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

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const id = params?.id;
    const { mode } = query;
    const modeStr = typeof mode === "string" ? mode : null;
    let work: WorkPublic;
    try {
      const res = await serverSideAxios.get(`/work/work/${id}/public`);
      work = res.data;
    } catch (e) {
      if (isAxiosError(e)) {
        console.error(e.response?.data);
      }
    }

    work.description = work.description.substring(0, 100);
    return { props: { id, modeStr, workPublic: work } };
  } catch (error) {
    return { props: { errors: (error as Error).message } };
  }
};
