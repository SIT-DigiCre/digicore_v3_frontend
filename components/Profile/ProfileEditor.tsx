import { Alert, Avatar, Button, Container, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDiscordLogin } from "../../hook/profile/useDiscordLogin";
import { useMyIntroduction } from "../../hook/profile/useIntroduction";
import { useMyProfile } from "../../hook/profile/useProfile";
import { FileObject } from "../../interfaces/file";
import { User } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";
import MarkdownEditor from "../Common/MarkdownEditor";
import { FileBrowserModal } from "../File/FileBrowser";
import PrivateProfileEditor from "./PrivateProfileEditor";

const ProfileEditor = () => {
  const [userProfile] = useMyProfile();
  const discordLogin = useDiscordLogin();
  const [userIntro, updateIntro] = useMyIntroduction();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>();
  useEffect(() => {
    setEditUserIntro({ md: (" " + userIntro).slice(1) });
  }, [userIntro]);
  if (!userProfile || !editUserIntro) return <p>isLoading...</p>;
  return (
    <>
      <Grid sx={{ mb: 3 }}>
        <h1>プロファイル編集</h1>
        <Grid sx={{ mb: 3 }}>
          <h2>公開情報（他の部員も見れる情報）</h2>
        </Grid>
        <Grid sx={{ mb: 3 }}>
          <h2>非公開情報</h2>
          <PrivateProfileEditor />
        </Grid>
        <Grid sx={{ mb: 3 }}>
          <h2>Discord連携</h2>
          <Button href={discordLogin.loginUrl} variant="contained">
            {userProfile.discordUserId == "" ? "Discord連携" : "Discord再連携"}
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

type PublicProfileEditorProps = {
  onSave?: () => void;
};

export const PublicProfileEditor = ({ onSave }: PublicProfileEditorProps) => {
  const [userProfile, updateProfile] = useMyProfile();
  const [editUserProfile, setEditUserProfile] = useState<User>(userProfile);
  useEffect(() => {
    setEditUserProfile(userProfile);
  }, [userProfile]);

  const [openFileModal, setOpenFileModal] = useState(false);
  const router = useRouter();

  if (!userProfile || !editUserProfile) return <p>isLoading...</p>;
  const onAvatarImageSelected = (file: FileObject) => {
    setEditUserProfile({ ...editUserProfile, iconUrl: file.url });
    setOpenFileModal(false);
  };
  return (
    <>
      {userProfile.iconUrl === "" ? (
        <Alert severity="warning">アイコンを設定しましょう!</Alert>
      ) : (
        <></>
      )}
      {userProfile.iconUrl === "" ? (
        <></>
      ) : (
        <Avatar src={editUserProfile.iconUrl} sx={{ margin: 1 }} />
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
      {userProfile.studentNumber === userProfile.username ? (
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
          setEditUserProfile({ ...editUserProfile, shortIntroduction: e.target.value });
        }}
        value={editUserProfile.shortIntroduction}
      />
      <Button
        variant="contained"
        disabled={objectEquals(userProfile, editUserProfile)}
        onClick={() => {
          updateProfile(editUserProfile).then((result) => {
            if (!result) return;
            if (onSave) {
              onSave();
            } else {
              router.reload();
            }
          });
        }}
      >
        保存
      </Button>
    </>
  );
};
