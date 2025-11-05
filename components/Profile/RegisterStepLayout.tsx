import { useRouter } from "next/router";
import { ReactNode } from "react";

import { Box, Button, Container, Stack, Step, StepLabel, Stepper } from "@mui/material";

import PageHead from "../Common/PageHead";

interface RegisterStepLayoutProps {
  children: ReactNode;
  title?: string;
  onNext?: () => void;
  onPrev?: () => void;
  nextDisabled?: boolean;
}

const RegisterStepLayout = ({
  children,
  title = "プロフィール登録",
  onNext,
  onPrev,
  nextDisabled = false,
}: RegisterStepLayoutProps) => {
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
      <PageHead title={title} />
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

        <Stack sx={{ mt: 2, justifyContent: "space-between" }} direction="row">
          <Button variant="outlined" onClick={onPrev} disabled={getCurrentStep() === 0}>
            前へ
          </Button>
          <Button variant="contained" onClick={onNext} disabled={nextDisabled}>
            次へ
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default RegisterStepLayout;
