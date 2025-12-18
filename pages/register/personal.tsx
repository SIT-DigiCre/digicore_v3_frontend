import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { Box, Button, Stack } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import Heading from "../../components/Common/Heading";
import EmergencyContactForm from "../../components/Profile/EmergencyContactForm";
import PersonalInfoForm from "../../components/Profile/PersonalInfoForm";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
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

type RegisterPersonalProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const RegisterPersonalProfilePage = ({
  initialPrivateProfile,
}: RegisterPersonalProfilePageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(initialPrivateProfile);

  const handleNext = async () => {
    if (!editProfile) return;
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "privateprofile-update-fail", message: "ログインが必要です" });
      return;
    }
    const response = await apiClient.PUT("/user/me/private", {
      body: editProfile,
      headers: { Authorization: `Bearer ${authState.token}` },
    });
    if (response.error) {
      setNewError({
        name: "privateprofile-update-fail",
        message: response.error.message || "ユーザー情報の更新に失敗しました",
      });
      return;
    }
    removeError("privateprofile-update-fail");
    router.push("/register/discord");
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
    editProfile.parentName === "" ||
    editProfile.parentCellphoneNumber === "" ||
    editProfile.parentAddress === "";

  return (
    <>
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
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
          <ButtonLink variant="outlined" href="/register/public">
            前へ
          </ButtonLink>
          <Button variant="contained" onClick={handleNext} disabled={isNextDisabled}>
            次へ
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

RegisterPersonalProfilePage.getLayout = (page: ReactElement) => (
  <RegisterStepLayout>{page}</RegisterStepLayout>
);

export default RegisterPersonalProfilePage;
