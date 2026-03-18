import { useRouter } from "next/router";
import { useState, useTransition } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { apiClient } from "@/utils/fetch/client";

type ForceCheckoutButtonProps = {
  place: string;
  userId: string;
  username: string;
};

const ForceCheckoutButton = ({ place, userId, username }: ForceCheckoutButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const router = useRouter();

  const handleForceCheckout = async () => {
    if (!authState.token || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await apiClient.POST("/activity/checkout/{userId}", {
        body: { place },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        params: {
          path: { userId },
        },
      });

      if (error) {
        startTransition(() => {
          setNewError({
            message: `${username} さんの強制チェックアウトに失敗しました`,
            name: "activity-force-checkout-fail",
          });
        });
        return;
      }

      startTransition(() => {
        removeError("activity-force-checkout-fail");
        setOpen(false);
        void router.replace(router.asPath);
      });
    } catch {
      startTransition(() => {
        setNewError({
          message: `${username} さんの強制チェックアウトに失敗しました`,
          name: "activity-force-checkout-fail",
        });
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => setOpen(true)}
        disabled={isSubmitting || isPending}
        startIcon={
          isSubmitting || isPending ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <LogoutIcon />
          )
        }
      >
        強制退室
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          if (!isSubmitting && !isPending) {
            setOpen(false);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>強制チェックアウトの確認</DialogTitle>
        <DialogContent dividers>
          <Typography>{username} さんを強制的に退室させます。よろしいですか？</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isSubmitting || isPending}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleForceCheckout}
            disabled={isSubmitting || isPending}
            startIcon={
              isSubmitting || isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <LogoutIcon />
              )
            }
          >
            強制退室する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForceCheckoutButton;
