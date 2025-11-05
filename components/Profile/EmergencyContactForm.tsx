import { useEffect, useState } from "react";

import { Button, Stack, TextField, Typography } from "@mui/material";

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
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          保護者氏名
        </Typography>

        <TextField
          label="保護者氏名"
          required
          fullWidth
          onChange={(e) => {
            setEditProfile({ ...editProfile, parentName: e.target.value });
          }}
          value={editProfile.parentName}
        />
      </Stack>
      <PhoneInput
        onChange={(num) => {
          setEditProfile({ ...editProfile, parentCellphoneNumber: num });
        }}
        title="保護者携帯電話番号"
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
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          保護者住所
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="保護者住所"
            required
            onChange={(e) => {
              setEditProfile({ ...editProfile, parentAddress: e.target.value });
            }}
            value={editProfile.parentAddress}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="contained" onClick={copyPersonalAddress}>
            本人と同じ
          </Button>
        </Stack>
      </Stack>
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
