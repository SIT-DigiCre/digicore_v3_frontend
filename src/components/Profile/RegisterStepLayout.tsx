import { ReactNode } from "react";

import { Box, Container, Step, StepLabel, Stepper } from "@mui/material";
import { useRouter } from "next/router";

import PageHead from "../Common/PageHead";

interface RegisterStepLayoutProps {
  children: ReactNode;
}

const RegisterStepLayout = ({ children }: RegisterStepLayoutProps) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const steps = [
    { label: "公開情報", path: `/register/public`, value: "public" },
    { label: "個人情報", path: `/register/personal`, value: "personal" },
    { label: "Discord連携", path: `/register/discord`, value: "discord" },
    { label: "自己紹介", path: `/register/introduction`, value: "introduction" },
  ];

  const getCurrentStep = () => {
    const currentStep = steps.findIndex((step) => currentPath.startsWith(step.path));
    return currentStep !== -1 ? currentStep : 0;
  };

  return (
    <>
      <PageHead title="プロフィール登録" />
      <Container sx={{ my: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={getCurrentStep()} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.value}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box>{children}</Box>
      </Container>
    </>
  );
};

export default RegisterStepLayout;
