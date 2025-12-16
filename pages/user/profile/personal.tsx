import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import PersonalInfoForm from "../../../components/Profile/PersonalInfoForm";
import { usePrivateProfile } from "../../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../../interfaces/user";
import { createServerApiClient } from "../../../utils/fetch/client";

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

type PersonalProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PersonalProfilePage = ({ initialPrivateProfile }: PersonalProfilePageProps) => {
  const [, updateProfile] = usePrivateProfile(true);
  const [privateProfile] = useState<UserPrivateProfile | null>(initialPrivateProfile);
  const [editProfile, setEditProfile] = useState<UserPrivateProfile | null>(initialPrivateProfile);

  useEffect(() => {
    setEditProfile(privateProfile);
  }, [privateProfile]);

  const handleSave = () => {
    if (!editProfile) return;
    updateProfile(editProfile);
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditProfile(profile);
  };

  return (
    <Stack spacing={2}>
      <Heading level={2}>本人情報</Heading>
      <PersonalInfoForm
        initialProfile={privateProfile}
        profile={editProfile}
        onProfileChange={handleProfileChange}
        onSave={handleSave}
        showSaveButton={true}
      />
    </Stack>
  );
};

PersonalProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default PersonalProfilePage;
