import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { Stack } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import { useErrorState } from "../../../components/contexts/ErrorStateContext";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import PersonalInfoForm from "../../../components/Profile/PersonalInfoForm";
import { useAuthState } from "../../../hook/useAuthState";
import { DEFAULT_USER_PRIVATE_PROFILE, UserPrivateProfile } from "../../../interfaces/user";
import { apiClient, createServerApiClient } from "../../../utils/fetch/client";

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

type PersonalProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PersonalProfilePage = ({ initialPrivateProfile }: PersonalProfilePageProps) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(initialPrivateProfile);

  const handleSave = async () => {
    if (!editProfile) return;
    if (!authState.isLogined || !authState.token) {
      setNewError({ message: "ログインが必要です", name: "privateprofile-update-fail" });
      return;
    }
    const response = await apiClient.PUT("/user/me/private", {
      body: editProfile,
      headers: { Authorization: `Bearer ${authState.token}` },
    });
    if (response.error) {
      setNewError({
        message: response.error.message || "ユーザー情報の更新に失敗しました",
        name: "privateprofile-update-fail",
      });
      return;
    }
    removeError("privateprofile-update-fail");
    router.push(router.asPath);
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  return (
    <>
      <Stack spacing={2}>
        <Heading level={2}>本人情報の設定</Heading>
        <PersonalInfoForm
          initialProfile={initialPrivateProfile}
          profile={editProfile}
          onProfileChange={handleProfileChange}
          onSave={handleSave}
          showSaveButton={true}
        />
      </Stack>
    </>
  );
};

PersonalProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default PersonalProfilePage;
