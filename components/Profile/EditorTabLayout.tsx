import { useRouter } from "next/router";
import { ReactNode } from "react";

import { Box, Container, Tab, Tabs } from "@mui/material";

import PageHead from "../Common/PageHead";

interface EditorTabLayoutProps {
  children: ReactNode;
  title?: string;
}

const EditorTabLayout = ({ children, title = "プロフィール編集" }: EditorTabLayoutProps) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const basePath = "/user/profile";

  const steps = [
    { label: "公開プロフィール", value: "public", path: `${basePath}/public` },
    { label: "本人情報", value: "personal", path: `${basePath}/personal` },
    { label: "緊急連絡先", value: "emergency", path: `${basePath}/emergency` },
    { label: "Discord連携", value: "discord", path: `${basePath}/discord` },
    { label: "自己紹介", value: "introduction", path: `${basePath}/introduction` },
  ];

  const getCurrentStep = () => {
    const currentStep = steps.findIndex((step) => currentPath.startsWith(step.path));
    return currentStep !== -1 ? currentStep : 0;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    const selectedStep = steps.find((step) => step.value === newValue);
    if (selectedStep) {
      router.push(selectedStep.path);
    }
  };

  return (
    <>
      <PageHead title={title} />
      <Container sx={{ my: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={steps[getCurrentStep()]?.value || "public"}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {steps.map((step) => (
              <Tab key={step.value} label={step.label} value={step.value} />
            ))}
          </Tabs>
        </Box>

        <Box>{children}</Box>
      </Container>
    </>
  );
};

export default EditorTabLayout;
