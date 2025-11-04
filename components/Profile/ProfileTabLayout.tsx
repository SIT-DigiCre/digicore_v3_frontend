import { useRouter } from "next/router";
import { ReactNode } from "react";

import { Box, Button, Container, Grid, Step, StepLabel, Stepper, Tab, Tabs } from "@mui/material";

import PageHead from "../Common/PageHead";

interface ProfileTabLayoutProps {
  children: ReactNode;
  isRegisterMode?: boolean;
  title?: string;
  showNavigation?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  nextDisabled?: boolean;
}

const ProfileTabLayout = ({
  children,
  isRegisterMode = false,
  title = "プロフィール編集",
  showNavigation = false,
  onNext,
  onPrev,
  nextDisabled = false,
}: ProfileTabLayoutProps) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const basePath = isRegisterMode ? "/user/register" : "/user/profile";

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
        {isRegisterMode ? (
          // 登録モードの場合はStepper
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={getCurrentStep()}>
              {steps.map((step) => (
                <Step key={step.value}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        ) : (
          // 編集モードの場合はTabs
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
        )}

        <Box>{children}</Box>

        {isRegisterMode && showNavigation && (
          <Grid sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={onPrev} disabled={getCurrentStep() === 0}>
              前へ
            </Button>
            <Button
              variant="contained"
              onClick={onNext}
              disabled={nextDisabled || getCurrentStep() === steps.length - 1}
            >
              次へ
            </Button>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default ProfileTabLayout;
