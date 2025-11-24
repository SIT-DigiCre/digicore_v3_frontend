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

import { useBudgets } from "../../hook/budget/useBudget";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { BudgetClass } from "../../interfaces/budget";

type NewBudgetDialogProps = {
  open: boolean;
  onClose: () => void;
};

const classList: BudgetClass[] = ["room", "project", "outside", "fixed", "festival"];
const classDisplay: {
  [K in BudgetClass]: string;
} = {
  room: "部室",
  project: "企画",
  outside: "学外活動",
  fixed: "固定費用",
  festival: "学園祭",
};

export const NewBudgetDialog = ({ open, onClose }: NewBudgetDialogProps) => {
  const [inputName, setInputName] = useState("");
  const [inputClass, setInputClass] = useState<BudgetClass | undefined>();
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();
  const { createBudget } = useBudgets();
  const router = useRouter();

  const onClickCreate = () => {
    const name = inputName;
    const className = inputClass;
    if (name == "" || className == undefined) {
      alert("稟議名が空、もしくは種別が指定されていません");
    } else {
      createBudget({ name: name, class: className, proposerUserId: authState.user.userId })
        .then((budgetId) => {
          onClose();
          router.push(`/budget/${budgetId}?mode=edit`);
        })
        .catch((error) => {
          console.error("Error creating budget:", error);
          setNewError({ name: "post-budget", message: "稟議申請に失敗しました" });
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>新規稟議申請</DialogTitle>
      <IconButton
        aria-label="稟議申請をやめる"
        onClick={onClose}
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
