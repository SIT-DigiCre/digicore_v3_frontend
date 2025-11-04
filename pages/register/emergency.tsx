import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import EmergencyContactForm from "../../components/Profile/EmergencyContactForm";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { useAuthState } from "../../hook/useAuthState";
import { UserPrivateProfile } from "../../interfaces/user";

const RegisterEmergencyProfilePage = () => {
  const router = useRouter();
  const { authState } = useAuthState();
  const [privateProfile, updateProfile] = usePrivateProfile(false);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(privateProfile);

  useEffect(() => {
    if (!authState.isLoading && !authState.isLogined) {
      router.push("/login");
    }
  }, [authState, router]);

  const handleNext = () => {
    updateProfile(editProfile).then((result) => {
      if (result) {
        router.push("/register/discord");
      }
    });
  };

  const handlePrev = () => {
    router.push("/register/personal");
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!privateProfile) return <p>Loading...</p>;

  return (
    <RegisterStepLayout
      title="プロフィール登録"
      onNext={handleNext}
      onPrev={handlePrev}
      nextDisabled={
        editProfile.parentName === "" ||
        editProfile.parentCellphoneNumber === "" ||
        editProfile.parentAddress === ""
      }
    >
      <Stack spacing={2}>
        <Typography variant="h5">緊急連絡先</Typography>
        <EmergencyContactForm
          profile={privateProfile}
          onProfileChange={handleProfileChange}
          showSaveButton={false}
        />
      </Stack>
    </RegisterStepLayout>
  );
};

export default RegisterEmergencyProfilePage;
