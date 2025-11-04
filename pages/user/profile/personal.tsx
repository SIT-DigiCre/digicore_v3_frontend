import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import ProfileTabLayout from "../../../components/Profile/ProfileTabLayout";
import PersonalInfoForm from "../../../components/Profile/PersonalInfoForm";
import { useAuthState } from "../../../hook/useAuthState";
import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../../interfaces/user";

const PersonalProfilePage = () => {
  const router = useRouter();
  const { authState } = useAuthState();
  const [privateProfile, updateProfile] = usePrivateProfile(false);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(privateProfile);

  useEffect(() => {
    if (!authState.isLoading && !authState.isLogined) {
      router.push("/login");
    }
  }, [authState, router]);

  const handleSave = () => {
    updateProfile(editProfile).then((result) => {
      if (result) {
        // 保存成功時の処理（必要に応じて次のタブに移動）
      }
    });
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!privateProfile) return <p>Loading...</p>;

  return (
    <ProfileTabLayout>
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
    </ProfileTabLayout>
  );
};

export default PersonalProfilePage;
