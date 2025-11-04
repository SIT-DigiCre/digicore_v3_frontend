import { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";

import NameInput from "./NameInput";
import PhoneInput from "./PhoneInput";

interface PersonalInfoFormProps {
  profile: UserPrivateProfile;
  onProfileChange: (profile: UserPrivateProfile) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
  saveButtonText?: string;
  disabled?: boolean;
}

const PersonalInfoForm = ({
  profile,
  onProfileChange,
  onSave,
  showSaveButton = false,
  saveButtonText = "保存",
  disabled = false,
}: PersonalInfoFormProps) => {
  const [editProfile, setEditProfile] = useState<UserPrivateProfile>(profile);

  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  useEffect(() => {
    onProfileChange(editProfile);
  }, [editProfile, onProfileChange]);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Stack spacing={4} py={4}>
      <NameInput
        firstNameTitle="名字"
        lastNameTitle="名前"
        onChange={(first, last) => {
          setEditProfile({
            ...editProfile,
            firstName: first,
            lastName: last,
          });
        }}
        initFirstName={editProfile.firstName}
        initLastName={editProfile.lastName}
      />
      <NameInput
        firstNameTitle="ミョウジ"
        lastNameTitle="ナマエ"
        onChange={(first, last) => {
          setEditProfile({
            ...editProfile,
            firstNameKana: first,
            lastNameKana: last,
          });
        }}
        initFirstName={editProfile.firstNameKana}
        initLastName={editProfile.lastNameKana}
      />
      <Stack spacing={2}>
        <Typography variant="h6">性別（戸籍上のものを入力してください）</Typography>
        <FormControl>
          <RadioGroup
            value={editProfile.isMale ? "male" : "female"}
            name="sex-radio-group"
            row
            onChange={(e) => {
              setEditProfile({
                ...editProfile,
                isMale: e.target.value === "male",
              });
            }}
          >
            <FormControlLabel value="female" control={<Radio />} label="女性" />
            <FormControlLabel value="male" control={<Radio />} label="男性" />
          </RadioGroup>
        </FormControl>
      </Stack>
      <PhoneInput
        onChange={(num) => {
          setEditProfile({ ...editProfile, phoneNumber: num });
        }}
        title="携帯電話番号"
        required
        initPhoneNumber={editProfile.phoneNumber}
      />
      <TextField
        label="住所"
        fullWidth
        required
        margin="normal"
        onChange={(e) => {
          setEditProfile({ ...editProfile, address: e.target.value });
        }}
        value={editProfile.address}
        helperText="郵便番号無しで入力してください"
      />
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

export default PersonalInfoForm;
