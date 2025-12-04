import { useRouter } from "next/router";
import { useRef, useState, useTransition } from "react";

import { Close, PersonAdd } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { apiClient } from "../../utils/fetch/client";

type UserOption = {
  userId: string;
  username: string;
  iconUrl: string;
};

type AddUserDialogProps = {
  groupId: string;
};

const AddUserDialog = ({ groupId }: AddUserDialogProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();

  const loadUsers = async () => {
    if (!authState.isLogined || !authState.token) return;

    setIsLoadingUsers(true);
    try {
      const response = await apiClient.GET("/user", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.error || !response.data?.users) {
        return;
      }

      setUserOptions(
        response.data.users.map((user) => ({
          userId: user.userId,
          username: user.username,
          iconUrl: user.iconUrl || "",
        })),
      );
    } catch (error) {
      console.error("Error loading users:", error);
      setNewError({ name: "load-users-error", message: "ユーザー一覧の取得に失敗しました" });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleClose = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSelectedUser(null);
    setInputValue("");
    setUserOptions([]);
    setIsDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      setNewError({ name: "add-user-validation", message: "ユーザーを選択してください" });
      return;
    }

    try {
      startTransition(async () => {
        const response = await apiClient.POST("/group/{groupId}/user", {
          params: {
            path: {
              groupId,
            },
          },
          body: {
            userId: selectedUser.userId,
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (response.error) {
          const errorMessage = response.error.message || "ユーザーの追加に失敗しました";
          setNewError({ name: "add-user-error", message: errorMessage });
          return;
        }
      });
      await router.replace(router.asPath);
    } catch (error) {
      console.error("Error adding user to group:", error);
      setNewError({ name: "add-user-error", message: "ユーザーの追加に失敗しました" });
    }
  };

  return (
    <>
      <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setIsDialogOpen(true)}>
        メンバーを追加
      </Button>
      <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>メンバーを追加</DialogTitle>
        <IconButton
          aria-label="メンバー追加をやめる"
          onClick={handleClose}
          disabled={isPending}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <Autocomplete
                options={userOptions}
                getOptionLabel={(option) => option.username}
                loading={isLoadingUsers}
                value={selectedUser}
                inputValue={inputValue}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason !== "input") return;

                  setInputValue(newInputValue);

                  if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                  }

                  // 0文字以上入力されたとき1秒デバウンスしてユーザー一覧を取得して更新する
                  if (newInputValue.length > 0) {
                    debounceTimerRef.current = setTimeout(() => {
                      loadUsers();
                    }, 1000);
                  } else {
                    setUserOptions([]);
                  }
                }}
                onChange={(_, newValue) => {
                  setSelectedUser(newValue);
                  setInputValue(newValue?.username || "");
                }}
                disabled={isPending}
                loadingText="ユーザー一覧を取得中..."
                renderOption={(props, option) => (
                  <li {...props} key={option.userId}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={option.iconUrl} sx={{ width: 32, height: 32 }}>
                        {option.username.charAt(0)}
                      </Avatar>
                      <Typography>{option.username}</Typography>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="ユーザーを選択" placeholder="ユーザー名で検索" />
                )}
              />
            </FormControl>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleClose} disabled={isPending}>
                キャンセル
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isPending || !selectedUser}
                startIcon={<PersonAdd />}
              >
                追加する
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
