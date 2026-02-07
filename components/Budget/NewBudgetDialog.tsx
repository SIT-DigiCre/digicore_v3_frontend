import { useRouter } from "next/router";
import { useState } from "react";

import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { apiClient } from "../../utils/fetch/client";

import type { BudgetClass } from "../../interfaces/budget";

type NewBudgetDialogProps = {
  open: boolean;
  onClose: () => void;
};

const classList: BudgetClass[] = ["room", "project", "outside", "fixed", "festival"];
const classDisplay: {
  [K in BudgetClass]: string;
} = {
  festival: "学園祭",
  fixed: "固定費用",
  outside: "学外活動",
  project: "企画",
  room: "部室",
};

export const NewBudgetDialog = ({ open, onClose }: NewBudgetDialogProps) => {
  const [inputName, setInputName] = useState("");
  const [inputClass, setInputClass] = useState<BudgetClass | undefined>();
  const { setNewError, removeError } = useErrorState();
  const { authState } = useAuthState();
  const router = useRouter();

  const onClickCreate = async () => {
    const name = inputName;
    const className = inputClass;
    if (name === "" || className === undefined) {
      alert("稟議名が空、もしくは種別が指定されていません");
    } else {
      if (!authState.user || !authState.token) return;

      try {
        const { data } = await apiClient.POST("/budget", {
          body: {
            class: className,
            name: name,
            proposerUserId: authState.user.userId!,
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (data) {
          removeError("budget-post-fail");
          onClose();
          router.push(`/budget/${data.budgetId}/edit`);
        } else {
          setNewError({ message: "稟議の申請に失敗しました", name: "budget-post-fail" });
        }
      } catch {
        setNewError({ message: "稟議の申請に失敗しました", name: "budget-post-fail" });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>新規稟議申請</DialogTitle>
      <IconButton
        aria-label="稟議申請をやめる"
        onClick={onClose}
        sx={{
          color: (theme) => theme.palette.grey[500],
          position: "absolute",
          right: 12,
          top: 12,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ padding: 2 }}>
          <TextField
            required
            label="稟議名"
            variant="outlined"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
            }}
          />
        </FormControl>
        <FormControl fullWidth required sx={{ padding: 2 }}>
          <InputLabel sx={{ margin: 2 }}>種別</InputLabel>
          <Select
            value={inputClass}
            label="種別"
            onChange={(e) => setInputClass(e.target.value as BudgetClass)}
          >
            {classList.map((c) => (
              <MenuItem value={c} key={c}>
                {classDisplay[c]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            onClick={onClickCreate}
            disabled={inputName === "" || inputClass === undefined}
            startIcon={<Add />}
          >
            作成する
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
