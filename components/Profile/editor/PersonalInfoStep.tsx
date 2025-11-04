import { useState } from "react";

import { Stack, Typography } from "@mui/material";

import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../../interfaces/user";
import PersonalInfoForm from "../PersonalInfoForm";

interface PersonalInfoStepProps {
  onNext?: () => void;
}

const PersonalInfoStep = ({ onNext }: PersonalInfoStepProps) => {
  const [privateProfile, updateProfile] = usePrivateProfile(false);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(privateProfile);

  const handleSave = () => {
    updateProfile(editProfile).then((result) => {
      if (result && onNext) onNext();
    });
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  if (!privateProfile) return <p>Loading...</p>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">本人情報</Typography>
      <PersonalInfoForm
        profile={privateProfile}
        onProfileChange={handleProfileChange}
        onSave={handleSave}
        showSaveButton={true}
        saveButtonText="保存"
      />
    </Stack>
  );
};

export default PersonalInfoStep;
