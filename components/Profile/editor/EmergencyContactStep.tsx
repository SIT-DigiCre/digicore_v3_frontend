import { useState } from "react";

import { Stack, Typography } from "@mui/material";

import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../../interfaces/user";
import EmergencyContactForm from "../EmergencyContactForm";

interface EmergencyContactStepProps {
  onNext?: () => void;
}

const EmergencyContactStep = ({ onNext }: EmergencyContactStepProps) => {
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
      <Typography variant="h5">緊急連絡先</Typography>
      <EmergencyContactForm
        profile={privateProfile}
        onProfileChange={handleProfileChange}
        onSave={handleSave}
        showSaveButton={true}
        saveButtonText="保存"
      />
    </Stack>
  );
};

export default EmergencyContactStep;
