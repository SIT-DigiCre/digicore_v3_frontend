import { Dispatch, SetStateAction, useState } from "react";

import { Button, Container, Grid } from "@mui/material";

import DiscordStep from "./editor/DiscordStep";
import EditorStepper from "./editor/EditorStepper";
import IntroductionStep from "./editor/IntroductionStep";
import PrivateProfileStep from "./editor/PrivateProfileStep";
import PublicProfileStep from "./editor/PublicProfileStep";

const ProfileEditor = () => {
  const [step, setStep] = useState(0);

  return (
    <Container sx={{ my: 2 }}>
      <h1>プロフィール編集</h1>
      <EditorStepper activeStep={step} />
      <Grid sx={{ mt: 3 }}>
        <Steps step={step} setStep={setStep} />
      </Grid>
    </Container>
  );
};

type StepsProps = { step: number; setStep: Dispatch<SetStateAction<number>> };
const Steps = ({ step, setStep }: StepsProps) => {
  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const renderNavigationButtons = () => (
    <Grid sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
      <Button variant="outlined" onClick={handlePrev} disabled={step === 0}>
        前へ
      </Button>
      <Button variant="contained" onClick={handleNext} disabled={step === 3}>
        次へ
      </Button>
    </Grid>
  );

  switch (step) {
    case 0:
      return (
        <>
          <PublicProfileStep onNext={handleNext} />
          {renderNavigationButtons()}
        </>
      );
    case 1:
      return (
        <>
          <PrivateProfileStep onNext={handleNext} />
          {renderNavigationButtons()}
        </>
      );
    case 2:
      return (
        <>
          <DiscordStep onNext={handleNext} />
          {renderNavigationButtons()}
        </>
      );
    case 3:
      return (
        <>
          <IntroductionStep onNext={handleNext} />
          {renderNavigationButtons()}
        </>
      );
    default:
      return null;
  }
};

export default ProfileEditor;
