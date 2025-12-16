import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import EmergencyContactForm from "../../../components/Profile/EmergencyContactForm";
import { useAuthState } from "../../../hook/useAuthState";
import { useErrorState } from "../../../hook/useErrorState";
import { UserPrivateProfile } from "../../../interfaces/user";
import { apiClient, createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = createServerApiClient(req);

  try {
    const privateRes = await client.GET("/user/me/private");

    if (!privateRes.data) {
      return { props: { initialPrivateProfile: null } };
    }

    return { props: { initialPrivateProfile: privateRes.data as unknown as UserPrivateProfile } };
  } catch (error) {
    console.error("Failed to fetch my private profile:", error);
    return { props: { initialPrivateProfile: null } };
  }
};

type EmergencyProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const EmergencyProfilePage = ({ initialPrivateProfile }: EmergencyProfilePageProps) => {
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [privateProfile, setPrivateProfile] = useState<UserPrivateProfile | null>(initialPrivateProfile);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile | null>(initialPrivateProfile);

  useEffect(() => {
    setEditProfile(privateProfile);
  }, [privateProfile]);

  const handleSave = async () => {
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
    setPrivateProfile(editProfile);
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  return (
    <>
      <Stack spacing={2}>
        <Heading level={2}>緊急連絡先の設定</Heading>
        <EmergencyContactForm
          initialProfile={privateProfile}
          profile={editProfile}
          onProfileChange={handleProfileChange}
          onSave={handleSave}
          showSaveButton={true}
        />
      </Stack>
    </>
  );
};

EmergencyProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default EmergencyProfilePage;
