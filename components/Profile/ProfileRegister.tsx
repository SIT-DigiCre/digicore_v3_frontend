import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Container } from "@mui/material";

import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { useAuthState } from "../../hook/useAuthState";

import CompletionStep from "./register/CompletionStep";
import DiscordStep from "./register/DiscordStep";
import PersonalInfoStep from "./register/PersonalInfoStep";
import ProfileStep from "./register/ProfileStep";
import RegisterStepper from "./register/RegisterStepper";

const ProfileRegister = () => {
  const { authState } = useAuthState();
  const [privateProfile] = usePrivateProfile();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!authState.isLogined) return;
    if (authState.user.username !== authState.user.studentNumber) {
      // eslint-disable-next-line no-console
      console.log(authState.user);
      if (privateProfile.firstName !== "") {
        if (authState.user.discordUserId !== "") setStep(3);
        else setStep(2);
      } else setStep(1);
    }
  }, [authState, privateProfile]);

  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <Container sx={{ my: 2 }}>
          <RegisterStepper activeStep={step} />
          <Steps step={step} setStep={setStep} />
        </Container>
      )}
    </>
  );
};
export default ProfileRegister;
type StepsProps = { step: number; setStep: Dispatch<SetStateAction<number>> };
const Steps = ({ step, setStep }: StepsProps) => {
  const handleNext = () => {
    setStep(step + 1);
  };

  switch (step) {
    case 0:
      return <ProfileStep onNext={handleNext} />;
    case 1:
      return <PersonalInfoStep onNext={handleNext} />;
    case 2:
      return <DiscordStep />;
    case 3:
      return <CompletionStep />;
    default:
      return null;
  }
};
