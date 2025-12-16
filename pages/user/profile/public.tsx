import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import { FileBrowserModal } from "../../../components/File/FileBrowser";
import { FileUploader } from "../../../components/File/FileUploader";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useMyFiles } from "../../../hook/file/useFile";
import { useAuthState } from "../../../hook/useAuthState";
import { useErrorState } from "../../../hook/useErrorState";
import { FileObject } from "../../../interfaces/file";
import { DEFAULT_USER, User } from "../../../interfaces/user";
import { objectEquals } from "../../../utils/common";
import { apiClient, createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const profileRes = await client.GET("/user/me");

    if (!profileRes.data) {
      return { props: { initialUserProfile: DEFAULT_USER } } as const;
    }

    return { props: { initialUserProfile: profileRes.data } } as const;
  } catch (error) {
    console.error("Failed to fetch my profile:", error);
    return { props: { initialUserProfile: DEFAULT_USER } } as const;
  }
};

type PublicProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PublicProfilePage = ({ initialUserProfile }: PublicProfilePageProps) => {
  const router = useRouter();
  const { myFileInfos } = useMyFiles();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editUserProfile, setEditUserProfile] = useState<User>(initialUserProfile);
  const [openFileModal, setOpenFileModal] = useState(false);

  const onAvatarImageSelected = (file: FileObject) => {
    if (!editUserProfile) return;
    setEditUserProfile({ ...editUserProfile, iconUrl: file.url });
    setOpenFileModal(false);
  };

  const handleSave = async () => {
    if (!editUserProfile) return;
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "profile-update-fail", message: "ログインが必要です" });
      return;
    }
    const response = await apiClient.PUT("/user/me", {
      body: editUserProfile,
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
    if (response.error) {
      setNewError({
        name: "profile-update-fail",
        message: response.error.message || "ユーザー情報の更新に失敗しました",
      });
      return;
    }
    removeError("profile-update-fail");
    router.push(router.asPath);
  };

  return (
    <Stack spacing={2}>
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
            {editUserProfile?.iconUrl === "" ? (
              <Typography color="error">アイコンを設定しましょう!</Typography>
            ) : (
              <Avatar src={editUserProfile?.iconUrl} sx={{ margin: 1 }} />
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
            initialUserProfile.studentNumber === editUserProfile.username
              ? "ユーザー名を学番以外で設定しましょう!"
              : "ハンドルネームなどを指定しましょう"
          }
          error={initialUserProfile.studentNumber === editUserProfile.username}
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
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            disabled={
              objectEquals(initialUserProfile, editUserProfile) ||
              editUserProfile.iconUrl === "" ||
              editUserProfile.username === "" ||
              editUserProfile.shortIntroduction === ""
            }
            onClick={handleSave}
          >
            保存する
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

PublicProfilePage.getLayout = (page: ReactElement) => <EditorTabLayout>{page}</EditorTabLayout>;

export default PublicProfilePage;
