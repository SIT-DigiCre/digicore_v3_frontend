import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import { useErrorState } from "../../components/contexts/ErrorStateContext";
import MarkdownEditor from "../../components/Markdown/MarkdownEditor";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
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

type RegisterIntroductionProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RegisterIntroductionProfilePage = ({
  initialIntroduction,
}: RegisterIntroductionProfilePageProps) => {
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
      sessionStorage.setItem("register", "true");
      router.push("/register/joined");
    }
  };

  return (
    <>
      <Typography>
        自分が作ってきた作品や活動について書いてみましょう。まだ作品がない方はこれからどんなものを作りたいかでも構いません。学科名は記載しても良いですが、学年は別で表示されるので不要です。
      </Typography>
      <MarkdownEditor
        value={editUserIntro.md}
        onChange={(e) => {
          setEditUserIntro({ md: e });
        }}
      />
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
        <ButtonLink variant="outlined" href="/register/discord" startIcon={<ArrowBack />}>
          前へ
        </ButtonLink>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={20} /> : <ArrowForward />}
        >
          次へ
        </Button>
      </Stack>
    </>
  );
};

RegisterIntroductionProfilePage.getLayout = (page: ReactElement) => (
  <RegisterStepLayout>{page}</RegisterStepLayout>
);

export default RegisterIntroductionProfilePage;
