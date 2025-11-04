import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../interfaces/user";

import PersonalInfoForm from "./PersonalInfoForm";
import EmergencyContactForm from "./EmergencyContactForm";

type PrivatePersonalProfileEditorProps = {
  onSave?: () => void;
  isRegisterMode?: boolean;
};

export const PrivatePersonalProfileEditor = ({
  onSave,
  isRegisterMode,
}: PrivatePersonalProfileEditorProps) => {
  const [privateProfile, updateProfile] = usePrivateProfile(isRegisterMode);
  const [editPrivateProfile, setEditPrivateProfile] = useState<UserPrivateProfile>(privateProfile);
  
  useEffect(() => {
    setEditPrivateProfile(privateProfile);
  }, [privateProfile]);

  const handleSave = () => {
    updateProfile(editPrivateProfile).then((result) => {
      if (onSave && result) onSave();
    });
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditPrivateProfile(profile);
  };

  if (!editPrivateProfile) return <p>Loading...</p>;
  
  return (
    <PersonalInfoForm
      profile={privateProfile}
      onProfileChange={handleProfileChange}
      onSave={handleSave}
      showSaveButton={true}
      saveButtonText="保存"
    />
  );
};

type PrivateParentProfileEditorProps = {
  onSave?: () => void;
  isRegisterMode?: boolean;
};

export const PrivateParentProfileEditor = ({
  onSave,
  isRegisterMode,
}: PrivateParentProfileEditorProps) => {
  const [privateProfile, updateProfile] = usePrivateProfile(isRegisterMode);
  const [editPrivateProfile, setEditPrivateProfile] = useState<UserPrivateProfile>(privateProfile);
  
  useEffect(() => {
    setEditPrivateProfile(privateProfile);
  }, [privateProfile]);

  const handleSave = () => {
    updateProfile(editPrivateProfile).then((result) => {
      if (onSave && result) onSave();
    });
  };

  const handleProfileChange = (profile: UserPrivateProfile) => {
    setEditPrivateProfile(profile);
  };

  if (!editPrivateProfile) return <p>Loading...</p>;
  
  return (
    <EmergencyContactForm
      profile={privateProfile}
      onProfileChange={handleProfileChange}
      onSave={handleSave}
      showSaveButton={true}
      saveButtonText="保存"
    />
  );
};

const PrivateProfileEditor = () => {
  return (
    <>
      <details>
        <summary>本人情報</summary>
        <PrivatePersonalProfileEditor />
      </details>
      <details>
        <summary>緊急連絡先</summary>
        <PrivateParentProfileEditor />
      </details>
    </>
  );
};

export default PrivateProfileEditor;
