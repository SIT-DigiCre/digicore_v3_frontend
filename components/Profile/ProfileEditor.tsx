import { Button, Container, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useProfile } from "../../hook/profile/useProfile";
import { UserProfileAPIData } from "../../interfaces/api";
import { baseURL, objectEquals } from "../../utils/common";
import PrivateProfileEditor from "./PrivateProfileEditor";

const ProfileEditor = () => {
  const [userProfile, updateProfile] = useProfile();
  const [editUserProfile, setEditUserProfile] = useState<UserProfileAPIData>(userProfile);
  useEffect(() => {
    setEditUserProfile(userProfile);
  }, [userProfile]);
  if (!userProfile || !editUserProfile) return <p>isLoading...</p>;

  return (
    <Container sx={{ mx: 5, my: 3 }}>
      <Grid sx={{ mb: 3 }}>
        <h1>プロファイル編集</h1>
        <Grid sx={{ mb: 3 }}>
          <h2>公開情報（他の部員も見れる情報）</h2>
          <TextField
            label="ユーザー名"
            variant="outlined"
            required
            helperText="ハンドルネームなどを指定しましょう"
            margin="normal"
            fullWidth
            onChange={(e) => {
              setEditUserProfile({ ...editUserProfile, username: e.target.value });
            }}
            value={editUserProfile.username}
          />
          <TextField
            label="短い自己紹介文"
            variant="outlined"
            helperText="学科やどんなことをしているか簡潔に書きましょう"
            margin="normal"
            fullWidth
            onChange={(e) => {
              setEditUserProfile({ ...editUserProfile, short_self_introduction: e.target.value });
            }}
            value={editUserProfile.short_self_introduction}
          />
          <Button
            variant="contained"
            disabled={objectEquals(userProfile, editUserProfile)}
            onClick={() => {
              updateProfile(editUserProfile);
            }}
          >
            保存
          </Button>
        </Grid>
        <Grid sx={{ mb: 3 }}>
          <h2>非公開情報</h2>
          <PrivateProfileEditor />
        </Grid>
        <Grid sx={{ mb: 3 }}>
          <h2>Discord連携</h2>
          <Button href={baseURL + "/discord/oauth/url"} variant="contained">
            {userProfile.discord_userid == "" ? "Discord連携" : "Discord再連携"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileEditor;
