import { Step, StepLabel, Stepper } from "@mui/material";

interface RegisterStepperProps {
  activeStep: number;
}

const RegisterStepper = ({ activeStep }: RegisterStepperProps) => {
  return (
    <Stepper activeStep={activeStep}>
      <Step>
        <StepLabel>プロフィール</StepLabel>
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
    </Stepper>
  );
};

export default RegisterStepper;
