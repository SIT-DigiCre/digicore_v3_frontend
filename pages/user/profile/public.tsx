import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import { FileBrowserModal } from "../../../components/File/FileBrowser";
import { FileUploader } from "../../../components/File/FileUploader";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useMyFiles } from "../../../hook/file/useFile";
import { useMyProfile } from "../../../hook/profile/useProfile";
import { FileObject } from "../../../interfaces/file";
import { User } from "../../../interfaces/user";
import { objectEquals } from "../../../utils/common";
import { createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = createServerApiClient(req);

  try {
    const profileRes = await client.GET("/user/me");

    if (!profileRes.data) {
      return { props: { initialUserProfile: null } };
    }

    return { props: { initialUserProfile: profileRes.data } };
  } catch (error) {
    console.error("Failed to fetch my profile:", error);
    return { props: { initialUserProfile: null } };
  }
};

type PublicProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PublicProfilePage = ({ initialUserProfile }: PublicProfilePageProps) => {
  const router = useRouter();
  const { myFileInfos } = useMyFiles();
  const [, updateProfile] = useMyProfile();
  const [userProfile, setUserProfile] = useState<User | null>(initialUserProfile);
  const [editUserProfile, setEditUserProfile] = useState<User | null>(initialUserProfile);
  const [openFileModal, setOpenFileModal] = useState(false);

  useEffect(() => {
    setEditUserProfile(userProfile);
  }, [userProfile]);

  const handleNext = () => {
    router.push("/user/profile/personal");
  };

  const onAvatarImageSelected = (file: FileObject) => {
    if (!editUserProfile) return;
    setEditUserProfile({ ...editUserProfile, iconUrl: file.url });
    setOpenFileModal(false);
  };

  const handleSave = () => {
    if (!editUserProfile) return;
    updateProfile(editUserProfile).then((result) => {
      if (result) {
        setUserProfile(editUserProfile);
        handleNext();
      }
    });
  };

  return (
    <>
      <Heading level={2}>公開情報の設定</Heading>
      <Typography>ここで設定した情報は、他の部員も閲覧できます。</Typography>
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
    </>
  );
};

PublicProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default PublicProfilePage;
