import { useRouter } from "next/router";

import { ArrowBack } from "@mui/icons-material";
import { Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import WorkEditor from "../../components/Work/WorkEditor";
import { useWorks } from "../../hook/work/useWork";
import { WorkRequest } from "../../interfaces/work";

const WorkCreatePage = () => {
  const router = useRouter();
  const { createWork } = useWorks();

  const onSubmit = (workRequest: WorkRequest) => {
    (async () => {
      const res = await createWork(workRequest);
      if (res === "error") return;
      router.push(`/work/${res}`);
    })();
  };

  return (
    <>
      <PageHead title="作品を投稿する" />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<ArrowBack />} variant="text">
          作品一覧に戻る
        </ButtonLink>
      </Stack>
      <WorkEditor onSubmit={onSubmit} />
    </>
  );
};
export default WorkCreatePage;
