import { ReactNode } from "react";

import { Box, Button, Container, Step, StepLabel, Stepper, Stack } from "@mui/material";

import PageHead from "../Common/PageHead";

type JoinedPageLayoutProps = {
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

const STEPS = ["ようこそ", "Mattermost登録", "Mattermostアプリ", "Discord登録", "部費振込"];

export const JoinedPageLayout = ({
  title,
  step,
  children,
  onNext,
  onPrevious,
  nextLabel = "次へ",
  previousLabel = "戻る",
  showNext = true,
  showPrevious = true,
}: JoinedPageLayoutProps) => {
  return (
    <>
      <PageHead title={title} />
      <Container>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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
