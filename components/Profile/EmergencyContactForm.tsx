import { Button, Stack, TextField, Typography } from "@mui/material";

import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";
import Heading from "../Common/Heading";
import PhoneInput from "./PhoneInput";

type EmergencyContactFormProps = {
  initialProfile: UserPrivateProfile;
  profile: UserPrivateProfile;
  onProfileChange: (profile: UserPrivateProfile) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
};

const EmergencyContactForm = ({
  initialProfile,
  profile,
  onProfileChange,
  onSave,
  showSaveButton = false,
}: EmergencyContactFormProps) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const copyPersonalAddress = () => {
    onProfileChange({
      ...profile,
      parentAddress: profile.address,
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
            onProfileChange({ ...profile, parentName: e.target.value });
          }}
          value={profile.parentName}
        />
      </Stack>
      <PhoneInput
        onChange={(num) => {
          onProfileChange({ ...profile, parentCellphoneNumber: num });
        }}
        title="保護者携帯電話番号"
        required
        initialPhoneNumber={profile.parentCellphoneNumber}
      />
      <PhoneInput
        onChange={(num) => {
          onProfileChange({ ...profile, parentHomephoneNumber: num });
        }}
        title="固定電話番号（ある場合のみ記入）"
        initialPhoneNumber={profile.parentHomephoneNumber}
      />
      <Stack spacing={2}>
        <Heading level={4}>保護者住所</Heading>
        <Stack direction="row" spacing={2}>
          <TextField
            label="保護者住所"
            required
            onChange={(e) => {
              onProfileChange({ ...profile, parentAddress: e.target.value });
            }}
            value={profile.parentAddress}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="contained" onClick={copyPersonalAddress}>
            本人と同じ
          </Button>
        </Stack>
      </Stack>
      {showSaveButton && (
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            disabled={objectEquals(profile, initialProfile)}
            onClick={handleSave}
          >
            保存する
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default EmergencyContactForm;
