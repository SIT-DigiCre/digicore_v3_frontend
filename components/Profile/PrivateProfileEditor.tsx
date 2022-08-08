import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateAPIData } from "../../interfaces/api";
import { objectEquals } from "../../utils/common";
import NameInput from "./NameInput";
import PhoneInput from "./PhoneInput";

const PrivateProfileEditor = () => {
  const [privateProfile, updateProfile] = usePrivateProfile();
  const [editPrivateProfile, setEditPrivateProfile] = useState<UserPrivateAPIData>(privateProfile);
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
                first_name: first,
                last_name: last,
              });
            }}
            initFirstName={editPrivateProfile.first_name}
            initLastName={editPrivateProfile.last_name}
          />
          <NameInput
            title="氏名（カタカナ）"
            firstNameTitle="ミョウジ"
            lastNameTitle="ナマエ"
            onChange={(first, last) => {
              setEditPrivateProfile({
                ...editPrivateProfile,
                first_name_kana: first,
                last_name_kana: last,
              });
            }}
            initFirstName={editPrivateProfile.first_name_kana}
            initLastName={editPrivateProfile.last_name_kana}
          />
          <PhoneInput
            onChange={(num) => {
              setEditPrivateProfile({ ...editPrivateProfile, phone_number: num });
            }}
            title="携帯電話番号"
            required
            initPhoneNumber={editPrivateProfile.phone_number}
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
              setEditPrivateProfile({ ...editPrivateProfile, parent_name: e.target.value });
            }}
            value={editPrivateProfile.parent_name}
          />
          <PhoneInput
            onChange={(num) => {
              setEditPrivateProfile({ ...editPrivateProfile, parent_cellphone_number: num });
            }}
            title="携帯電話番号"
            required
            initPhoneNumber={editPrivateProfile.parent_cellphone_number}
          />
          <PhoneInput
            onChange={(num) => {
              setEditPrivateProfile({ ...editPrivateProfile, parent_homephone_number: num });
            }}
            title="固定電話番号（ある場合のみ記入）"
            initPhoneNumber={editPrivateProfile.parent_homephone_number}
          />
          <TextField
            label="住所"
            fullWidth
            required
            margin="normal"
            onChange={(e) => {
              setEditPrivateProfile({ ...editPrivateProfile, parent_address: e.target.value });
            }}
            value={editPrivateProfile.parent_address}
            helperText="郵便番号無しで入力してください"
          />
          <Button
            variant="contained"
            onClick={() => {
              setEditPrivateProfile({
                ...editPrivateProfile,
                parent_address: editPrivateProfile.address,
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
