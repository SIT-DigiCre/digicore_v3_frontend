import { Button } from "@mui/material";

import { useDiscordLogin } from "../../../hook/profile/useDiscordLogin";
import { useMyProfile } from "../../../hook/profile/useProfile";

interface DiscordStepProps {
  onNext?: () => void;
}

const DiscordStep = ({ onNext }: DiscordStepProps) => {
  const [userProfile] = useMyProfile();
  const discordLogin = useDiscordLogin();

  if (!userProfile) return <p>isLoading...</p>;

  return (
    <div>
      <h2>Discord連携</h2>
      <Button href={discordLogin.loginUrl} variant="contained">
        {userProfile.discordUserId == "" ? "Discord連携" : "Discord再連携"}
      </Button>
    </div>
  );
};

export default DiscordStep;
