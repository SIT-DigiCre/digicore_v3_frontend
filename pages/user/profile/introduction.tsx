import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { Button, Stack } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import MarkdownEditor from "../../../components/Markdown/MarkdownEditor";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useAuthState } from "../../../hook/useAuthState";
import { useErrorState } from "../../../hook/useErrorState";
import { apiClient, createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const introRes = await client.GET("/user/me/introduction");

    if (!introRes.data) {
      return { props: { initialIntroduction: "" } } as const;
    }

    return { props: { initialIntroduction: introRes.data.introduction ?? "" } } as const;
  } catch (error) {
    console.error("Failed to fetch my introduction:", error);
    return { props: { initialIntroduction: "" } } as const;
  }
};

type IntroductionProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IntroductionProfilePage = ({ initialIntroduction }: IntroductionProfilePageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>({ md: initialIntroduction });

  const handleSave = async () => {
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "introduction-update-fail", message: "ログインが必要です" });
      return;
    }
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
      return;
    }
    removeError("introduction-update-fail");
    router.push(router.asPath);
  };

  return (
    <Stack spacing={2}>
      <Heading level={2}>自己紹介</Heading>
      <MarkdownEditor
        value={editUserIntro.md}
        onChange={(e) => {
          setEditUserIntro({ md: e });
        }}
      />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="contained"
          disabled={initialIntroduction === editUserIntro.md}
          onClick={handleSave}
        >
          保存する
        </Button>
      </Stack>
    </Stack>
  );
};

IntroductionProfilePage.getLayout = (page: ReactElement) => (
  <EditorTabLayout>{page}</EditorTabLayout>
);
export default IntroductionProfilePage;
