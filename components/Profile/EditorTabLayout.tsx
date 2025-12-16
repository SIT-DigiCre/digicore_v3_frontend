import { useRouter } from "next/router";
import { ReactNode } from "react";

import ChatIcon from "@mui/icons-material/Chat";
import EmergencyIcon from "@mui/icons-material/Emergency";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PublicIcon from "@mui/icons-material/Public";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { Box, Tab, Tabs } from "@mui/material";

import PageHead from "../Common/PageHead";

interface EditorTabLayoutProps {
  children: ReactNode;
  title?: string;
}

const EditorTabLayout = ({ children }: EditorTabLayoutProps) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const basePath = "/user/profile";

  const steps = [
    { label: "公開情報", icon: <PublicIcon />, value: "public", path: `${basePath}/public` },
    {
      label: "本人情報",
      icon: <HealthAndSafetyIcon />,
      value: "personal",
      path: `${basePath}/personal`,
    },
    {
      label: "緊急連絡先",
      icon: <EmergencyIcon />,
      value: "emergency",
      path: `${basePath}/emergency`,
    },
    { label: "Discord連携", icon: <ChatIcon />, value: "discord", path: `${basePath}/discord` },
    {
      label: "自己紹介",
      icon: <RecordVoiceOverIcon />,
      value: "introduction",
      path: `${basePath}/introduction`,
    },
  ] as const;

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
      <PageHead title="プロフィール更新" />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={steps[getCurrentStep()]?.value || "public"}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {steps.map((step) => (
            <Tab
              key={step.value}
              label={step.label}
              value={step.value}
              icon={step.icon}
              iconPosition="start"
              sx={{ minHeight: 0 }}
            />
          ))}
        </Tabs>
      </Box>
      <Box>{children}</Box>
    </>
  );
};

export default EditorTabLayout;
