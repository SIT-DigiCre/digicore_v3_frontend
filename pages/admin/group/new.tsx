import { useRouter } from "next/router";
import { useState, useTransition } from "react";

import { Add, ArrowBack } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";

import { ButtonLink } from "../../../components/Common/ButtonLink";
import Heading from "../../../components/Common/Heading";
import PageHead from "../../../components/Common/PageHead";
import { useAuthState } from "../../../hook/useAuthState";
import { useErrorState } from "../../../hook/useErrorState";
import { apiClient } from "../../../utils/fetch/client";

const AdminGroupNewPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinable, setJoinable] = useState(true);
  const [isAdminGroup, setIsAdminGroup] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setNewError({ name: "new-group-validation", message: "グループ名と説明を入力してください" });
      return;
    }

    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "new-group-auth", message: "ログインが必要です" });
      return;
    }

    try {
      startTransition(async () => {
        const response = await apiClient.POST("/group", {
          body: {
            name: name.trim(),
            description: description.trim(),
            isAdminGroup,
            joinable: !isAdminGroup && joinable,
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        if (response.error) {
          const errorMessage = response.error.message || "グループの作成に失敗しました";
          setNewError({ name: "new-group-error", message: errorMessage });
          return;
        }
        router.push("/admin/group");
      });
    } catch (error) {
      console.error("Error creating group:", error);
      setNewError({ name: "new-group-error", message: "グループの作成に失敗しました" });
    }
  };

  return (
    <>
      <PageHead title="[管理者用] 新規グループ作成" />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin/group" startIcon={<ArrowBack />} variant="text">
            グループ一覧に戻る
          </ButtonLink>
        </Stack>
        <Heading level={2}>新規グループ作成</Heading>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <TextField
              required
              label="グループ名"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              label="グループの説明"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </FormControl>

          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdminGroup}
                  onChange={(e) => setIsAdminGroup(e.target.checked)}
                  disabled={isPending}
                />
              }
              label="管理者グループにする"
            />
            <FormHelperText>
              管理者グループは管理者のみが作成でき、自発的な参加はできません。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isAdminGroup && joinable}
                  onChange={(e) => setJoinable(e.target.checked)}
                  disabled={isPending || isAdminGroup}
                />
              }
              label="参加可能にする"
            />
            <FormHelperText>
              チェックを外すと、メンバーからの自発的な参加はできません。
            </FormHelperText>
          </FormControl>

          <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 2 }}>
            <ButtonLink variant="outlined" href="/admin/group">
              キャンセル
            </ButtonLink>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isPending || !name.trim() || !description.trim()}
              startIcon={<Add />}
            >
              作成する
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default AdminGroupNewPage;
