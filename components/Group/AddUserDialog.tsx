import { useState, useEffect } from "react";

import { PersonAdd, Close } from "@mui/icons-material";
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
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId: string;
};

const AddUserDialog = ({ open, onClose, onSuccess, groupId }: AddUserDialogProps) => {
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();

  useEffect(() => {
    if (open && authState.isLogined && authState.token) {
      loadUsers();
    }
  }, [open, authState.isLogined, authState.token]);

  const loadUsers = async () => {
    if (!authState.isLogined || !authState.token) return;

    setIsLoadingUsers(true);
    try {
      const users: UserOption[] = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const response = await apiClient.GET("/user", {
          params: {
            query: {
              offset,
            },
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (response.error || !response.data?.users) {
          break;
        }

        const fetchedUsers = response.data.users.map((user) => ({
          userId: user.userId,
          username: user.username,
          iconUrl: user.iconUrl || "",
        }));

        users.push(...fetchedUsers);

        if (fetchedUsers.length < limit) {
          break;
        }

        offset += limit;
      }

      setUserOptions(users);
    } catch (error) {
      console.error("Error loading users:", error);
      setNewError({ name: "load-users-error", message: "ユーザー一覧の取得に失敗しました" });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedUser(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      setNewError({ name: "add-user-validation", message: "ユーザーを選択してください" });
      return;
    }

    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "add-user-auth", message: "ログインが必要です" });
      return;
    }

    setIsSubmitting(true);

    try {
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
        const errorMessage =
          response.error.message || "ユーザーの追加に失敗しました";
        setNewError({ name: "add-user-error", message: errorMessage });
        setIsSubmitting(false);
        return;
      }

      handleClose();
      onSuccess();
    } catch (error) {
      console.error("Error adding user to group:", error);
      setNewError({ name: "add-user-error", message: "ユーザーの追加に失敗しました" });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>メンバーを追加</DialogTitle>
      <IconButton
        aria-label="メンバー追加をやめる"
        onClick={handleClose}
        disabled={isSubmitting}
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
              onChange={(_, newValue) => setSelectedUser(newValue)}
              disabled={isSubmitting || isLoadingUsers}
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
                <TextField
                  {...params}
                  label="ユーザーを選択"
                  placeholder="ユーザー名で検索"
                />
              )}
            />
          </FormControl>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedUser}
              startIcon={<PersonAdd />}
            >
              追加する
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;

