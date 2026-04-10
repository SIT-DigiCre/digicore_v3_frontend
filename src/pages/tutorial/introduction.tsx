import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useState } from "react";

import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { useErrorState } from "../../components/contexts/ErrorStateContext";
import MarkdownEditor from "../../components/Markdown/MarkdownEditor";
import { TutorialStepLayout } from "../../components/Register/TutorialStepLayout";
import { useAuthState } from "../../hook/useAuthState";
import { apiClient, createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const introRes = await client.GET("/user/me/introduction");

    if (!introRes.data) {
      return { props: { initialIntroduction: "" } };
    }

    return { props: { initialIntroduction: introRes.data.introduction ?? "" } };
  } catch (error) {
    console.error("Failed to fetch my introduction:", error);
    return { props: { initialIntroduction: "" } };
  }
};

type TutorialIntroductionPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TutorialIntroductionPage = ({ initialIntroduction }: TutorialIntroductionPageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>({
    md: initialIntroduction,
  });
  const [isPending, setIsPending] = useState(false);

  const handleNext = async () => {
    setIsPending(true);
    removeError("introduction-update-fail");
    const response = await apiClient.PUT("/user/me/introduction", {
      body: { introduction: editUserIntro.md },
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
    if (response.error) {
      setNewError({
        message: response.error.message || "自己紹介情報の更新に失敗しました",
        name: "introduction-update-fail",
      });
      setIsPending(false);
    } else {
      router.push("/tutorial/joined");
    }
  };

  const handlePrevious = () => {
    router.push("/tutorial/personal-info");
  };

  const handleSkip = () => {
    router.push("/tutorial/joined");
  };

  return (
    <TutorialStepLayout
      title="自己紹介"
      step={3}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isPending={isPending}
    >
      <Stack spacing={3}>
        <Typography>
          自分が作ってきた作品や活動について書いてみましょう。まだ作品がない方はこれからどんなものを作りたいかでも構いません。学科名は記載しても良いですが、学年は別で表示されるので不要です。
        </Typography>

        <MarkdownEditor
          value={editUserIntro.md}
          onChange={(e) => {
            setEditUserIntro({ md: e });
          }}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="text" onClick={handleSkip}>
            今はスキップ
          </Button>
        </Stack>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialIntroductionPage;
