import { useRouter } from "next/router";
import { useState } from "react";

import { Box, Stack, Typography } from "@mui/material";

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
          <Typography level={3} sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 2 }}>
            本人情報
          </Typography>
          <PersonalInfoForm
            initialProfile={privateProfile}
            profile={editProfile}
            onProfileChange={handleProfileChange}
            showSaveButton={false}
          />
        </Box>
        <Box>
          <Typography level={3} sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 2 }}>
            緊急連絡先
          </Typography>
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
