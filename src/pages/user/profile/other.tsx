import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import type { ReactElement } from "react";

import { Stack } from "@mui/material";

import Heading from "@/components/Common/Heading";
import EditorTabLayout from "@/components/Profile/EditorTabLayout";
import GradeUpdateSection from "@/components/Profile/GradeUpdateSection";
import GraduationReportSection from "@/components/Profile/GraduationReportSection";
import { createServerApiClient } from "@/utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const response = await client.GET("/user/me/grade-update");

    if (!response.data || !response.data.gradeUpdates) {
      return { props: { gradeUpdates: [] } };
    }

    return {
      props: {
        gradeUpdates: response.data.gradeUpdates,
      },
    };
  } catch (error) {
    console.error("Failed to fetch my grade updates:", error);
    return { props: { gradeUpdates: [] } };
  }
};

const OtherProfilePage = ({
  gradeUpdates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Stack spacing={3}>
      <Heading level={2}>その他</Heading>
      <GradeUpdateSection gradeUpdates={gradeUpdates} />
      <GraduationReportSection />
    </Stack>
  );
};

OtherProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default OtherProfilePage;
