import { Step, StepLabel, Stepper } from "@mui/material";

interface RegisterStepperProps {
  activeStep: number;
}

const RegisterStepper = ({ activeStep }: RegisterStepperProps) => {
  return (
    <Stepper activeStep={activeStep}>
      <Step>
        <StepLabel>プロフィール登録</StepLabel>
      </Step>
      <Step>
        <StepLabel>個人情報登録</StepLabel>
      </Step>
      <Step>
        <StepLabel>Discord連携</StepLabel>
      </Step>
    </Stepper>
  );
};

export default RegisterStepper;
