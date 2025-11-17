import router from "next/router";
import { useEffect, useState } from "react";

import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import { FileBrowserModal } from "../../../components/File/FileBrowser";
import { FileUploader } from "../../../components/File/FileUploader";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useMyFiles } from "../../../hook/file/useFile";
import { useMyProfile } from "../../../hook/profile/useProfile";
import { useAuthState } from "../../../hook/useAuthState";
import { FileObject } from "../../../interfaces/file";
import { User } from "../../../interfaces/user";
import { objectEquals } from "../../../utils/common";

const PublicProfilePage = () => {
  const { authState } = useAuthState();
  const [userProfile, updateProfile] = useMyProfile();
  const { myFileInfos } = useMyFiles();
  const [editUserProfile, setEditUserProfile] = useState<User>(userProfile);
  const [openFileModal, setOpenFileModal] = useState(false);

  useEffect(() => {
    setEditUserProfile(userProfile);
  }, [userProfile]);

  const handleNext = () => {
    router.push("/user/profile/personal");
  };

  const onAvatarImageSelected = (file: FileObject) => {
    setEditUserProfile({ ...editUserProfile, iconUrl: file.url });
    setOpenFileModal(false);
  };

  const handleSave = () => {
    updateProfile(editUserProfile).then((result) => {
      if (result) {
        handleNext();
      }
    });
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!userProfile || !editUserProfile) return <p>isLoading...</p>;

  return (
    <EditorTabLayout>
      <div>
        <Heading level={3}>公開情報（他の部員も見れる情報）</Heading>
        <Stack spacing={4} py={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                onClick={() => {
                  setOpenFileModal(true);
                }}
              >
                アイコンを設定する
              </Button>
              {editUserProfile.iconUrl === "" ? (
                <Typography color="error">アイコンを設定しましょう!</Typography>
              ) : (
                <Avatar src={editUserProfile.iconUrl} sx={{ margin: 1 }} />
              )}
            </Stack>
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
          </Stack>
          <TextField
            label="ユーザー名"
            variant="outlined"
            required
            helperText={
              userProfile.studentNumber === editUserProfile.username
                ? "ユーザー名を学番以外で設定しましょう!"
                : "ハンドルネームなどを指定しましょう"
            }
            error={userProfile.studentNumber === editUserProfile.username}
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
            required
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
            disabled={
              objectEquals(userProfile, editUserProfile) ||
              editUserProfile.username === "" ||
              editUserProfile.shortIntroduction === ""
            }
            onClick={handleSave}
          >
            保存
          </Button>
        </Stack>
      </div>
    </EditorTabLayout>
  );
};

export default PublicProfilePage;
