import { ReactNode, useEffect, useRef } from "react";

import { Box, Button, Container, Step, StepLabel, Stepper, Stack } from "@mui/material";

import PageHead from "../Common/PageHead";

type TutorialStepLayoutProps = {
  title: string;
  step: number;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  showNext?: boolean;
  showPrevious?: boolean;
};

const STEPS = [
  "ようこそ",
  "公開プロフィール",
  "個人情報",
  "自己紹介",
  "入部完了",
  "Mattermost登録",
  "Mattermostアプリ",
  "Discord連携",
  "Discordサーバー",
  "部費振込",
];

const STEP_WIDTH = 120;

export const TutorialStepLayout = ({
  title,
  step,
  children,
  onNext,
  onPrevious,
  nextLabel = "次へ",
  previousLabel = "戻る",
  showNext = true,
  showPrevious = true,
}: TutorialStepLayoutProps) => {
  const stepperContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = stepperContainerRef.current;
    if (!container) return;

    const activeStepElement = container.querySelector(
      `[data-step-index="${step}"]`,
    ) as HTMLElement | null;
    if (!activeStepElement) return;

    const targetLeft =
      activeStepElement.offsetLeft + activeStepElement.offsetWidth / 2 - container.clientWidth / 2;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const clampedScrollLeft = Math.max(0, Math.min(targetLeft, maxScrollLeft));

    container.scrollTo({
      behavior: "smooth",
      left: clampedScrollLeft,
    });
  }, [step]);

  return (
    <>
      <PageHead title={title} />
      <Container>
        <Box
          ref={stepperContainerRef}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            mb: 4,
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
          }}
        >
          <Stepper
            activeStep={step}
            alternativeLabel
            sx={{
              "& .MuiStep-root": {
                flex: "0 0 auto",
                width: `${STEP_WIDTH}px`,
              },
              "& .MuiStepLabel-label": {
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                },
              },
              "& .MuiStepLabel-labelContainer": {
                whiteSpace: "nowrap",
              },
              minWidth: "100%",
              width: "max-content",
            }}
          >
            {STEPS.map((label, index) => (
              <Step key={label} data-step-index={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mb: 4, minHeight: "400px" }}>{children}</Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
          {showPrevious ? (
            <Button variant="outlined" onClick={onPrevious} disabled={step === 0}>
              {previousLabel}
            </Button>
          ) : (
            <Box />
          )}
          {showNext ? (
            <Button variant="contained" onClick={onNext} disabled={step === STEPS.length - 1}>
              {nextLabel}
            </Button>
          ) : (
            <Box />
          )}
        </Stack>
      </Container>
    </>
  );
};
