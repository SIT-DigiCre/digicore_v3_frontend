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

import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";

import NameInput from "./NameInput";
import PhoneInput from "./PhoneInput";

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
  if (!editPrivateProfile) return <p>Loading...</p>;
  return (
    <Stack spacing={4} py={4}>
      <NameInput
        firstNameTitle="名字"
        lastNameTitle="名前"
        onChange={(first, last) => {
          setEditPrivateProfile({
            ...editPrivateProfile,
            firstName: first,
            lastName: last,
          });
        }}
        initFirstName={editPrivateProfile.firstName}
        initLastName={editPrivateProfile.lastName}
      />
      <NameInput
        firstNameTitle="ミョウジ"
        lastNameTitle="ナマエ"
        onChange={(first, last) => {
          setEditPrivateProfile({
            ...editPrivateProfile,
            firstNameKana: first,
            lastNameKana: last,
          });
        }}
        initFirstName={editPrivateProfile.firstNameKana}
        initLastName={editPrivateProfile.lastNameKana}
      />
      <Stack spacing={2}>
        <Typography variant="h6">性別（戸籍上のものを入力してください）</Typography>
        <FormControl>
          <RadioGroup
            value={editPrivateProfile.isMale ? "male" : "female"}
            name="sex-radio-group"
            row
            onChange={(e) => {
              setEditPrivateProfile({
                ...editPrivateProfile,
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
          setEditPrivateProfile({ ...editPrivateProfile, phoneNumber: num });
        }}
        title="携帯電話番号"
        required
        initPhoneNumber={editPrivateProfile.phoneNumber}
      />
      <TextField
        label="住所"
        fullWidth
        required
        margin="normal"
        onChange={(e) => {
          setEditPrivateProfile({ ...editPrivateProfile, address: e.target.value });
        }}
        value={editPrivateProfile.address}
        helperText="郵便番号無しで入力してください"
      />
      <Button
        variant="contained"
        disabled={objectEquals(privateProfile, editPrivateProfile)}
        onClick={() => {
          updateProfile(editPrivateProfile).then((result) => {
            if (onSave && result) onSave();
          });
        }}
      >
        保存
      </Button>
    </Stack>
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
  if (!editPrivateProfile) return <p>Loading...</p>;
  return (
    <Stack spacing={4} py={4}>
      <TextField
        label="氏名"
        required
        margin="normal"
        fullWidth
        onChange={(e) => {
          setEditPrivateProfile({ ...editPrivateProfile, parentName: e.target.value });
        }}
        value={editPrivateProfile.parentName}
      />
      <PhoneInput
        onChange={(num) => {
          setEditPrivateProfile({ ...editPrivateProfile, parentCellphoneNumber: num });
        }}
        title="携帯電話番号"
        required
        initPhoneNumber={editPrivateProfile.parentCellphoneNumber}
      />
      <PhoneInput
        onChange={(num) => {
          setEditPrivateProfile({ ...editPrivateProfile, parentHomephoneNumber: num });
        }}
        title="固定電話番号（ある場合のみ記入）"
        initPhoneNumber={editPrivateProfile.parentHomephoneNumber}
      />
      <TextField
        label="住所"
        fullWidth
        required
        margin="normal"
        onChange={(e) => {
          setEditPrivateProfile({ ...editPrivateProfile, parentAddress: e.target.value });
        }}
        value={editPrivateProfile.parentAddress}
        helperText="郵便番号無しで入力してください"
      />
      <Button
        variant="contained"
        onClick={() => {
          setEditPrivateProfile({
            ...editPrivateProfile,
            parentAddress: editPrivateProfile.address,
          });
        }}
      >
        本人住所と同じにする
      </Button>
      <Button
        variant="contained"
        disabled={objectEquals(privateProfile, editPrivateProfile)}
        onClick={() => {
          updateProfile(editPrivateProfile).then((result) => {
            if (onSave && result) onSave();
          });
        }}
      >
        保存
      </Button>
    </Stack>
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
