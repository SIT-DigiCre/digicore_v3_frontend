import { useEffect, useState } from "react";

import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../interfaces/user";

import EmergencyContactForm from "./EmergencyContactForm";

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
      initialProfile={privateProfile}
      profile={editPrivateProfile}
      onProfileChange={handleProfileChange}
      onSave={handleSave}
      showSaveButton={true}
    />
  );
};

export default PrivateParentProfileEditor;
