import { useState } from "react";
import { Stack, Stepper, Step, StepLabel, Box } from "@mui/material";
import PersonalInfoStep from "./PersonalInfoStep";
import EmergencyContactStep from "./EmergencyContactStep";

interface PrivateProfileStepProps {
  onNext?: () => void;
}

const PrivateProfileStep = ({ onNext }: PrivateProfileStepProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (onNext) {
      onNext();
    }
  };

  const steps = ["本人情報", "緊急連絡先"];

  return (
    <Stack spacing={4}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box>
        {activeStep === 0 && <PersonalInfoStep onNext={handleNext} />}
        {activeStep === 1 && <EmergencyContactStep onNext={handleNext} />}
      </Box>
    </Stack>
  );
};

export default PrivateProfileStep;
