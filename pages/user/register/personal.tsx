import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import ProfileTabLayout from "../../../components/Profile/ProfileTabLayout";
import PersonalInfoForm from "../../../components/Profile/PersonalInfoForm";
import { useAuthState } from "../../../hook/useAuthState";
import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../../interfaces/user";

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
        router.push("/user/register/emergency");
      }
    });
  };

  const handlePrev = () => {
    router.push("/user/register/public");
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!privateProfile) return <p>Loading...</p>;

  return (
    <ProfileTabLayout 
      isRegisterMode={true} 
      title="プロフィール登録"
      showNavigation={true}
      onNext={handleNext}
      onPrev={handlePrev}
      nextDisabled={false}
    >
      <Stack spacing={2}>
        <Typography variant="h5">本人情報</Typography>
        <PersonalInfoForm
          profile={privateProfile}
          onProfileChange={handleProfileChange}
          showSaveButton={false}
        />
      </Stack>
    </ProfileTabLayout>
  );
};

export default RegisterPersonalProfilePage;
