import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useState } from "react";

import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";

import Heading from "../../components/Common/Heading";
import { useErrorState } from "../../components/contexts/ErrorStateContext";
import EmergencyContactForm from "../../components/Profile/EmergencyContactForm";
import PersonalInfoForm from "../../components/Profile/PersonalInfoForm";
import { TutorialStepLayout } from "../../components/Register/TutorialStepLayout";
import { useAuthState } from "../../hook/useAuthState";
import { DEFAULT_USER_PRIVATE_PROFILE, UserPrivateProfile } from "../../interfaces/user";
import { apiClient, createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const privateRes = await client.GET("/user/me/private");

    if (!privateRes.data) {
      return { props: { initialPrivateProfile: DEFAULT_USER_PRIVATE_PROFILE } };
    }

    return { props: { initialPrivateProfile: privateRes.data } };
  } catch (error) {
    console.error("Failed to fetch my private profile:", error);
    return { props: { initialPrivateProfile: DEFAULT_USER_PRIVATE_PROFILE } };
  }
};

type TutorialPersonalInfoPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TutorialPersonalInfoPage = ({ initialPrivateProfile }: TutorialPersonalInfoPageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(initialPrivateProfile);
  const [isPending, setIsPending] = useState(false);

  const handleNext = async () => {
    setIsPending(true);
    removeError("privateprofile-update-fail");
    const response = await apiClient.PUT("/user/me/private", {
      body: editProfile,
      headers: { Authorization: `Bearer ${authState.token}` },
    });
    if (response.error) {
      setNewError({
        message: response.error.message || "ユーザー情報の更新に失敗しました",
        name: "privateprofile-update-fail",
      });
      setIsPending(false);
    } else {
      router.push("/tutorial/introduction");
    }
  };

  const handlePrevious = () => {
    router.push("/tutorial/public-profile");
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  const isNextDisabled =
    editProfile.firstName === "" ||
    editProfile.lastName === "" ||
    editProfile.firstNameKana === "" ||
    editProfile.lastNameKana === "" ||
    editProfile.phoneNumber === "" ||
    editProfile.address === "" ||
    editProfile.parentLastName === "" ||
    editProfile.parentFirstName === "" ||
    editProfile.parentCellphoneNumber === "" ||
    editProfile.parentAddress === "";

  return (
    <TutorialStepLayout
      title="個人情報"
      step={2}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isPending={isPending}
      isNextDisabled={isNextDisabled}
    >
      <Stack spacing={4} mb={8}>
        <Box>
          <Heading level={3}>本人情報</Heading>
          <PersonalInfoForm
            initialProfile={initialPrivateProfile}
            profile={editProfile}
            onProfileChange={handleProfileChange}
            showSaveButton={false}
          />
        </Box>
        <Box>
          <Heading level={3}>緊急連絡先</Heading>
          <EmergencyContactForm
            initialProfile={initialPrivateProfile}
            profile={editProfile}
            onProfileChange={handleProfileChange}
            showSaveButton={false}
          />
        </Box>
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialPersonalInfoPage;
