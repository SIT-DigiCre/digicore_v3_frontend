import { useRouter } from "next/router";
import { useTransition } from "react";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, CircularProgress } from "@mui/material";

import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { apiClient } from "@/utils/fetch/client";

type CheckInOutButtonProps = {
  place: string;
  isCheckedIn: boolean;
};

const CheckInOutButton = ({ place, isCheckedIn }: CheckInOutButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const router = useRouter();

  const handleClick = () => {
    if (!authState.token) return;

    startTransition(async () => {
      try {
        const endpoint = isCheckedIn ? "/activity/checkout" : "/activity/checkin";
        const errorName = isCheckedIn ? "activity-checkout-fail" : "activity-checkin-fail";

        const { error } = await apiClient.POST(endpoint, {
          body: { place },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (error) {
          setNewError({
            message: isCheckedIn ? "退室処理に失敗しました" : "入室処理に失敗しました",
            name: errorName,
          });
        } else {
          removeError(isCheckedIn ? "activity-checkout-fail" : "activity-checkin-fail");
          router.replace(router.asPath);
        }
      } catch {
        setNewError({
          message: isCheckedIn ? "退室処理に失敗しました" : "入室処理に失敗しました",
          name: isCheckedIn ? "activity-checkout-fail" : "activity-checkin-fail",
        });
      }
    });
  };

  return (
    <Button
      variant="contained"
      size="large"
      color={isCheckedIn ? "error" : "primary"}
      disabled={isPending}
      startIcon={
        isPending ? (
          <CircularProgress size={20} color="inherit" />
        ) : isCheckedIn ? (
          <LogoutIcon />
        ) : (
          <LoginIcon />
        )
      }
      onClick={handleClick}
      sx={{ fontWeight: "bold", px: 4, py: 1.5 }}
    >
      {isCheckedIn ? "退室する" : "入室する"}
    </Button>
  );
};

export default CheckInOutButton;
