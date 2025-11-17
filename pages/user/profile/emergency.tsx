import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import EmergencyContactForm from "../../../components/Profile/EmergencyContactForm";
import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { useAuthState } from "../../../hook/useAuthState";
import { UserPrivateProfile } from "../../../interfaces/user";

const EmergencyProfilePage = () => {
  const { authState } = useAuthState();
  const [privateProfile, updateProfile] = usePrivateProfile(false);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(privateProfile);

  useEffect(() => {
    setEditProfile(privateProfile);
  }, [privateProfile]);

  const handleSave = () => {
    updateProfile(editProfile);
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!privateProfile) return <p>Loading...</p>;

  return (
    <EditorTabLayout>
      <Stack spacing={2}>
        <Heading level={3}>緊急連絡先</Heading>
        <EmergencyContactForm
          initialProfile={privateProfile}
          profile={editProfile}
          onProfileChange={handleProfileChange}
          onSave={handleSave}
          showSaveButton={true}
        />
      </Stack>
    </EditorTabLayout>
  );
};

export default EmergencyProfilePage;
