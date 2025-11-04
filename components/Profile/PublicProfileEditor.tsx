import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Alert, Avatar, Button, TextField } from "@mui/material";

import { useMyFiles } from "../../hook/file/useFile";
import { useMyProfile } from "../../hook/profile/useProfile";
import { FileObject } from "../../interfaces/file";
import { User } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";
import { FileBrowserModal } from "../File/FileBrowser";
import { FileUploader } from "../File/FileUploader";

type PublicProfileEditorProps = {
  onSave?: () => void;
};

export const PublicProfileEditor = ({ onSave }: PublicProfileEditorProps) => {
  const [userProfile, updateProfile] = useMyProfile();
  const { myFileInfos } = useMyFiles();
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
      {myFileInfos && myFileInfos.length === 0 ? (
        <FileUploader
          open={openFileModal}
          onCancel={() => {
            setOpenFileModal(false);
          }}
          onUploaded={onAvatarImageSelected}
          onlyFileKind="image"
        />
      ) : (
        <FileBrowserModal
          open={openFileModal}
          onCancel={() => {
            setOpenFileModal(false);
          }}
          onSelected={onAvatarImageSelected}
          onlyFileKind="image"
        />
      )}
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

export default PublicProfileEditor;
