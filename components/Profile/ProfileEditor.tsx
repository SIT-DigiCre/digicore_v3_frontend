import { Alert, Avatar, Button, Container, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMyIntroduction } from "../../hook/profile/useIntroduction";
import { useMyProfile } from "../../hook/profile/useProfile";
import { UserProfileAPIData } from "../../interfaces/api";
import { FileObject } from "../../interfaces/file";
import { baseURL, objectEquals } from "../../utils/common";
import MarkdownEditor from "../Common/MarkdownEditor";
import { FileBrowserModal } from "../File/FileBrowser";
import PrivateProfileEditor from "./PrivateProfileEditor";

const ProfileEditor = () => {
  const [userProfile, updateProfile] = useMyProfile();
  const [editUserProfile, setEditUserProfile] = useState<UserProfileAPIData>(userProfile);
  useEffect(() => {
    setEditUserProfile(userProfile);
  }, [userProfile]);
  const [userIntro, updateIntro] = useMyIntroduction();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>();
  useEffect(() => {
    setEditUserIntro({ md: (" " + userIntro).slice(1) });
  }, [userIntro]);
  const [openFileModal, setOpenFileModal] = useState(false);
  const router = useRouter();
  if (!userProfile || !editUserProfile || !editUserIntro) return <p>isLoading...</p>;
  const onAvatarImageSelected = (file: FileObject) => {
    setEditUserProfile({ ...editUserProfile, icon_url: file.url });
    setOpenFileModal(false);
  };
  return (
    <>
      <Grid sx={{ mb: 3 }}>
        <h1>プロファイル編集</h1>
        <Grid sx={{ mb: 3 }}>
          <h2>公開情報（他の部員も見れる情報）</h2>
          {userProfile.icon_url === "" ? (
            <Alert severity="warning">アイコンを設定しましょう!</Alert>
          ) : (
            <></>
          )}
          {userProfile.icon_url === "" ? (
            <></>
          ) : (
            <Avatar src={editUserProfile.icon_url} sx={{ margin: 1 }} />
          )}
          <Button
            variant="contained"
            onClick={() => {
              setOpenFileModal(true);
            }}
          >
            アイコン設定
          </Button>
          <FileBrowserModal
            open={openFileModal}
            onCancel={() => {
              setOpenFileModal(false);
            }}
            onSelected={onAvatarImageSelected}
            onlyFileKind="image"
          />
          {userProfile.student_number === userProfile.username ? (
            <Alert severity="warning">ユーザー名を学番以外で設定しましょう!</Alert>
          ) : (
            <></>
          )}
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
              updateProfile(editUserProfile).then(() => {
                router.reload();
              });
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
        <Grid>
          <h2>自己紹介ページ文章</h2>
          <MarkdownEditor
            value={editUserIntro.md}
            onChange={(e) => {
              setEditUserIntro({ md: e });
            }}
          />
          <Button
            variant="contained"
            disabled={userIntro === editUserIntro.md}
            onClick={() => {
              updateIntro(editUserIntro.md);
            }}
          >
            保存
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfileEditor;
