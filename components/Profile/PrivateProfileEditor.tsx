import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";
import NameInput from "./NameInput";
import PhoneInput from "./PhoneInput";

const PrivateProfileEditor = () => {
  const [privateProfile, updateProfile] = usePrivateProfile();
  const [editPrivateProfile, setEditPrivateProfile] = useState<UserPrivateProfile>(privateProfile);
  useEffect(() => {
    setEditPrivateProfile(privateProfile);
    console.log("SET_EDIT_PRIVATE_PROFILE");
  }, [privateProfile]);
  if (!editPrivateProfile) return <p>Loading...</p>;
  return (
    <>
      <details>
        <summary>本人情報</summary>
        <Grid>
          <NameInput
            title="氏名"
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
            title="氏名（カタカナ）"
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
          <h5>性別</h5>
          <FormControl>
            <RadioGroup
              value={editPrivateProfile.isMale ? "male" : "female"}
              name="sex-radio-group"
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
              updateProfile(editPrivateProfile);
            }}
          >
            保存
          </Button>
        </Grid>
      </details>
      <details>
        <summary>緊急連絡先</summary>
        <Grid>
          <TextField
            label="氏名"
            required
            margin="normal"
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
          <br />
          <Button
            variant="contained"
            disabled={objectEquals(privateProfile, editPrivateProfile)}
            onClick={() => {
              updateProfile(editPrivateProfile);
            }}
            sx={{ mt: 2 }}
          >
            保存
          </Button>
        </Grid>
      </details>
    </>
  );
};

export default PrivateProfileEditor;
