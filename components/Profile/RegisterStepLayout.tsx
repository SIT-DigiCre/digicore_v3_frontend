import { useRouter } from "next/router";
import { ReactNode } from "react";

import { Box, Container, Step, StepLabel, Stepper } from "@mui/material";

import PageHead from "../Common/PageHead";

interface RegisterStepLayoutProps {
  children: ReactNode;
}

const RegisterStepLayout = ({ children }: RegisterStepLayoutProps) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const steps = [
    { label: "公開情報", value: "public", path: `/register/public` },
    { label: "個人情報", value: "personal", path: `/register/personal` },
    { label: "Discord連携", value: "discord", path: `/register/discord` },
    { label: "自己紹介", value: "introduction", path: `/register/introduction` },
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
