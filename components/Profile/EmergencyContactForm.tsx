import { Save } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";

import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";
import Heading from "../Common/Heading";
import NameInput from "./NameInput";
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
        <Heading level={4}>保護者氏名</Heading>
        <NameInput
          firstNameTitle="保護者名字"
          lastNameTitle="保護者名前"
          onChange={(first, last) => {
            onProfileChange({
              ...profile,
              parentFirstName: last,
              parentLastName: first,
            });
          }}
          initFirstName={profile.parentLastName}
          initLastName={profile.parentFirstName}
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
        title="固定電話番号（ある場合のみ）"
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
            startIcon={<Save />}
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
