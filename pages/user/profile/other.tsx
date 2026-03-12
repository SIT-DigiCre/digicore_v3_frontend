import type { ReactElement } from "react";

import { Stack } from "@mui/material";

import Heading from "@/components/Common/Heading";
import EditorTabLayout from "@/components/Profile/EditorTabLayout";
import GraduationReportSection from "@/components/Profile/GraduationReportSection";

const OtherProfilePage = () => {
  return (
    <Stack spacing={3}>
      <Heading level={2}>その他</Heading>
      <GraduationReportSection />
    </Stack>
  );
};

OtherProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default OtherProfilePage;
