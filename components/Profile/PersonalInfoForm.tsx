import {
  Box,
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
  initialProfile: UserPrivateProfile;
  profile: UserPrivateProfile;
  onProfileChange: (profile: UserPrivateProfile) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
}

const PersonalInfoForm = ({
  initialProfile,
  profile,
  onProfileChange,
  onSave,
  showSaveButton = false,
}: PersonalInfoFormProps) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          氏名
        </Typography>
        <Stack spacing={2}>
          <NameInput
            firstNameTitle="名字"
            lastNameTitle="名前"
            onChange={(first, last) => {
              onProfileChange({
                ...profile,
                firstName: first,
                lastName: last,
              });
            }}
            initFirstName={profile.firstName}
            initLastName={profile.lastName}
          />
          <NameInput
            firstNameTitle="ミョウジ"
            lastNameTitle="ナマエ"
            onChange={(first, last) => {
              onProfileChange({
                ...profile,
                firstNameKana: first,
                lastNameKana: last,
              });
            }}
            initFirstName={profile.firstNameKana}
            initLastName={profile.lastNameKana}
          />
        </Stack>
      </Stack>
      <Box>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            性別
          </Typography>
          <Typography variant="body2" sx={{ margin: 0 }}>
            戸籍上のものを入力してください
          </Typography>
          <FormControl>
            <RadioGroup
              value={profile.isMale ? "male" : "female"}
              name="sex-radio-group"
              row
              onChange={(e) => {
                onProfileChange({
                  ...profile,
                  isMale: e.target.value === "male",
                });
              }}
            >
              <FormControlLabel value="male" control={<Radio />} label="男性" />
              <FormControlLabel value="female" control={<Radio />} label="女性" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </Box>
      <Box>
        <PhoneInput
          onChange={(num) => {
            onProfileChange({ ...profile, phoneNumber: num });
          }}
          title="携帯電話番号"
          required
          initialPhoneNumber={profile.phoneNumber}
        />
      </Box>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          住所
        </Typography>
        <TextField
          label="住所"
          fullWidth
          required
          margin="normal"
          onChange={(e) => {
            onProfileChange({ ...profile, address: e.target.value });
          }}
          value={profile.address}
          helperText="郵便番号無しで入力してください"
        />
      </Stack>
      {showSaveButton && (
        <Button
          variant="contained"
          disabled={objectEquals(profile, initialProfile)}
          onClick={handleSave}
        >
          保存
        </Button>
      )}
    </Stack>
  );
};

export default PersonalInfoForm;
