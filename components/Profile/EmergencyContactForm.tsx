import { useEffect, useState } from "react";

import { Button, Stack, TextField } from "@mui/material";

import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";

import PhoneInput from "./PhoneInput";

interface EmergencyContactFormProps {
  profile: UserPrivateProfile;
  onProfileChange: (profile: UserPrivateProfile) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
  saveButtonText?: string;
  disabled?: boolean;
}

const EmergencyContactForm = ({
  profile,
  onProfileChange,
  onSave,
  showSaveButton = false,
  saveButtonText = "保存",
  disabled = false,
}: EmergencyContactFormProps) => {
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(profile);

  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  useEffect(() => {
    onProfileChange(editProfile);
  }, [editProfile]);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const copyPersonalAddress = () => {
    setEditProfile({
      ...editProfile,
      parentAddress: editProfile.address,
    });
  };

  return (
    <Stack spacing={4} py={4}>
      <TextField
        label="氏名"
        required
        margin="normal"
        fullWidth
        onChange={(e) => {
          setEditProfile({ ...editProfile, parentName: e.target.value });
        }}
        value={editProfile.parentName}
      />
      <PhoneInput
        onChange={(num) => {
          setEditProfile({ ...editProfile, parentCellphoneNumber: num });
        }}
        title="携帯電話番号"
        required
        initPhoneNumber={editProfile.parentCellphoneNumber}
      />
      <PhoneInput
        onChange={(num) => {
          setEditProfile({ ...editProfile, parentHomephoneNumber: num });
        }}
        title="固定電話番号（ある場合のみ記入）"
        initPhoneNumber={editProfile.parentHomephoneNumber}
      />
      <TextField
        label="住所"
        fullWidth
        required
        margin="normal"
        onChange={(e) => {
          setEditProfile({ ...editProfile, parentAddress: e.target.value });
        }}
        value={editProfile.parentAddress}
        helperText="郵便番号無しで入力してください"
      />
      <Button variant="contained" onClick={copyPersonalAddress}>
        本人住所と同じにする
      </Button>
      {showSaveButton && (
        <Button
          variant="contained"
          disabled={disabled || objectEquals(profile, editProfile)}
          onClick={handleSave}
        >
          {saveButtonText}
        </Button>
      )}
    </Stack>
  );
};

export default EmergencyContactForm;
