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

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { GRANT_GROUP_ADMIN } from "@/utils/auth/grants";
import { apiClient } from "@/utils/fetch/client";

const AdminGroupNewPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinable, setJoinable] = useState(true);
  const [claim, setClaim] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();
  const canAccessGroupAdmin = authState.grants.includes(GRANT_GROUP_ADMIN);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setNewError({ message: "グループ名と説明を入力してください", name: "new-group-validation" });
      return;
    }

    if (!authState.isLogined || !authState.token) {
      setNewError({ message: "ログインが必要です", name: "new-group-auth" });
      return;
    }

    try {
      startTransition(async () => {
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        const trimmedClaim = claim.trim();

        const response = trimmedClaim
          ? await apiClient.POST("/group/admin", {
              body: {
                claim: trimmedClaim,
                description: trimmedDescription,
                joinable,
                name: trimmedName,
              },
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            })
          : await apiClient.POST("/group", {
              body: {
                description: trimmedDescription,
                joinable,
                name: trimmedName,
              },
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            });
        if (response.error) {
          const errorMessage = response.error.message || "グループの作成に失敗しました";
          setNewError({ message: errorMessage, name: "new-group-error" });
          return;
        }
        router.push("/admin/group");
      });
    } catch (error) {
      console.error("Error creating group:", error);
      setNewError({ message: "グループの作成に失敗しました", name: "new-group-error" });
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
            <TextField
              label="付与する claim（任意）"
              variant="outlined"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              disabled={isPending}
              placeholder="例: account / infra"
            />
            <FormHelperText>
              入力すると `POST /group/admin` で claim
              付きグループを作成します。空欄の場合は通常グループを作成します。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={joinable}
                  onChange={(e) => setJoinable(e.target.checked)}
                  disabled={isPending}
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
              disabled={isPending || !name.trim() || !description.trim() || !canAccessGroupAdmin}
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
