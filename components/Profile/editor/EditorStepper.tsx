import { Step, StepLabel, Stepper } from "@mui/material";

interface EditorStepperProps {
  activeStep: number;
}

const EditorStepper = ({ activeStep }: EditorStepperProps) => {
  return (
    <Stepper activeStep={activeStep}>
      <Step>
        <StepLabel>公開プロフィール</StepLabel>
      </Step>
      <Step>
        <StepLabel>本人情報</StepLabel>
      </Step>
      <Step>
        <StepLabel>緊急連絡先</StepLabel>
      </Step>
      <Step>
        <StepLabel>Discord連携</StepLabel>
      </Step>
      <Step>
        <StepLabel>自己紹介</StepLabel>
      </Step>
    </Stepper>
  );
};

export default EditorStepper;
