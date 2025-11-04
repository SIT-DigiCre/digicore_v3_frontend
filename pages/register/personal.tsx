import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import PersonalInfoForm from "../../components/Profile/PersonalInfoForm";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { useAuthState } from "../../hook/useAuthState";
import { UserPrivateProfile } from "../../interfaces/user";

const RegisterPersonalProfilePage = () => {
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
        router.push("/register/emergency");
      }
    });
  };

  const handlePrev = () => {
    router.push("/register/public");
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
        editProfile.firstName === "" ||
        editProfile.lastName === "" ||
        editProfile.firstNameKana === "" ||
        editProfile.lastNameKana === "" ||
        editProfile.phoneNumber === "" ||
        editProfile.address === ""
      }
    >
      <Stack spacing={2}>
        <Typography variant="h5">本人情報</Typography>
        <PersonalInfoForm
          profile={privateProfile}
          onProfileChange={handleProfileChange}
          showSaveButton={false}
        />
      </Stack>
    </RegisterStepLayout>
  );
};

export default RegisterPersonalProfilePage;
