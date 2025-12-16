import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Button, Stack } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import MarkdownEditor from "../../../components/Markdown/MarkdownEditor";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useMyIntroduction } from "../../../hook/profile/useIntroduction";
import { createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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

type IntroductionProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IntroductionProfilePage = ({ initialIntroduction }: IntroductionProfilePageProps) => {
  const [userIntro, updateIntro] = useMyIntroduction();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>({ md: initialIntroduction });

  useEffect(() => {
    setEditUserIntro({ md: (" " + userIntro).slice(1) });
  }, [userIntro]);

  const handleSave = () => {
    if (editUserIntro) {
      updateIntro(editUserIntro.md);
    }
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
          disabled={userIntro === editUserIntro.md}
          onClick={handleSave}
          sx={{ mt: 2 }}
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
