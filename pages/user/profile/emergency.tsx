import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import EmergencyContactForm from "../../../components/Profile/EmergencyContactForm";
import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { useAuthState } from "../../../hook/useAuthState";
import { UserPrivateProfile } from "../../../interfaces/user";

const EmergencyProfilePage = () => {
  const router = useRouter();
  const { authState } = useAuthState();
  const [privateProfile, updateProfile] = usePrivateProfile(false);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(privateProfile);

  useEffect(() => {
    if (!authState.isLoading && !authState.isLogined) {
      router.push("/login");
    }
  }, [authState, router]);

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
        <Typography level={3} sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 2 }}>
          緊急連絡先
        </Typography>
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
