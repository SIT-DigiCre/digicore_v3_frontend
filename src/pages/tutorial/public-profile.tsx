import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useState } from "react";

import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

import Heading from "../../components/Common/Heading";
import { useErrorState } from "../../components/contexts/ErrorStateContext";
import { FileBrowserModal } from "../../components/File/FileBrowser";
import { FileUploader } from "../../components/File/FileUploader";
import { TutorialStepLayout } from "../../components/Register/TutorialStepLayout";
import { useMyFiles } from "../../hook/file/useFile";
import { useAuthState } from "../../hook/useAuthState";
import { FileObject } from "../../interfaces/file";
import { DEFAULT_USER, User } from "../../interfaces/user";
import { apiClient, createServerApiClient } from "../../utils/fetch/client";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const client = createServerApiClient(req);

  try {
    const profileRes = await client.GET("/user/me");

    if (!profileRes.data) {
      return { props: { initialUserProfile: DEFAULT_USER } };
    }

    return { props: { initialUserProfile: profileRes.data } };
  } catch (error) {
    console.error("Failed to fetch my profile:", error);
    return { props: { initialUserProfile: DEFAULT_USER } };
  }
};

type TutorialPublicProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TutorialPublicProfilePage = ({ initialUserProfile }: TutorialPublicProfilePageProps) => {
  const router = useRouter();
  const { myFileInfos } = useMyFiles();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [editUserProfile, setEditUserProfile] = useState<User>(initialUserProfile);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const onAvatarImageSelected = (file: FileObject) => {
    setEditUserProfile({ ...editUserProfile, iconUrl: file.url });
    setOpenFileModal(false);
  };

  const handleNext = async () => {
    setIsPending(true);
    removeError("profile-update-fail");
    const response = await apiClient.PUT("/user/me", {
      body: editUserProfile,
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
    if (response.error) {
      setNewError({
        message: response.error.message || "ユーザー情報の更新に失敗しました",
        name: "profile-update-fail",
      });
      setIsPending(false);
    } else {
      router.push("/tutorial/personal-info");
    }
  };

  const handlePrevious = () => {
    router.push("/tutorial/welcome");
  };

  const isNextDisabled =
    editUserProfile.username === "" ||
    editUserProfile.shortIntroduction === "" ||
    editUserProfile.iconUrl === "" ||
    editUserProfile.username === initialUserProfile.studentNumber;

  return (
    <TutorialStepLayout
      title="公開プロフィール"
      step={1}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isPending={isPending}
      isNextDisabled={isNextDisabled}
    >
      <Stack spacing={4}>
        <Typography>
          他の部員に見られるプロフィール情報を設定します。ハンドルネームやアイコンを設定しましょう！
        </Typography>

        <Stack spacing={2}>
          <Heading level={3}>アイコンを設定する</Heading>
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
              <Avatar src={editUserProfile.iconUrl} sx={{ height: 56, width: 56 }} />
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
          multiline
          rows={3}
          onChange={(e) => {
            setEditUserProfile({ ...editUserProfile, shortIntroduction: e.target.value });
          }}
          value={editUserProfile.shortIntroduction}
        />
      </Stack>
    </TutorialStepLayout>
  );
};

export default TutorialPublicProfilePage;
