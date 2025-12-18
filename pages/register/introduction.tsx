import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, CircularProgress, Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import MarkdownEditor from "../../components/Markdown/MarkdownEditor";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
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
        name: "introduction-update-fail",
        message: response.error.message || "自己紹介情報の更新に失敗しました",
      });
      setIsPending(false);
    } else {
      sessionStorage.setItem("register", "true");
      router.push("/register/joined");
    }
  };

  return (
    <>
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
