import { useRouter } from "next/router";
import { useState } from "react";

import { Box, Stack } from "@mui/material";

import Heading from "../../components/Common/Heading";
import EmergencyContactForm from "../../components/Profile/EmergencyContactForm";
import PersonalInfoForm from "../../components/Profile/PersonalInfoForm";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../interfaces/user";

const RegisterPersonalProfilePage = () => {
  const router = useRouter();
  const [privateProfile, updateProfile] = usePrivateProfile(true);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(privateProfile);

  const handleNext = () => {
    updateProfile(editProfile).then((result) => {
      if (result) {
        router.push("/register/discord");
      }
    });
  };

  const handlePrev = () => {
    router.push("/register/public");
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

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
        editProfile.address === "" ||
        editProfile.parentName === "" ||
        editProfile.parentCellphoneNumber === "" ||
        editProfile.parentAddress === ""
      }
    >
      <Stack spacing={4} mb={8}>
        <Box>
          <Heading level={3}>本人情報</Heading>
          <PersonalInfoForm
            initialProfile={privateProfile}
            profile={editProfile}
            onProfileChange={handleProfileChange}
            showSaveButton={false}
          />
        </Box>
        <Box>
          <Heading level={3}>緊急連絡先</Heading>
          <EmergencyContactForm
            initialProfile={privateProfile}
            profile={editProfile}
            onProfileChange={handleProfileChange}
            showSaveButton={false}
          />
        </Box>
      </Stack>
    </RegisterStepLayout>
  );
};

export default RegisterPersonalProfilePage;
