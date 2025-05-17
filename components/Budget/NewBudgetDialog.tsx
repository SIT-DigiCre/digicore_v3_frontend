import { useRouter } from "next/router";
import { useState } from "react";

import { Close } from "@mui/icons-material";
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
  TextField,
} from "@mui/material";

import { useBudgets } from "../../hook/budget/useBudget";
import { useAuthState } from "../../hook/useAuthState";
import { useErrorState } from "../../hook/useErrorState";
import { BudgetClass, CreateBudgetRequest } from "../../interfaces/budget";

type Props = {
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
export const NewBudgetDialog = ({ open, onClose }: Props) => {
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
        .catch((e) => {
          setNewError({ name: "post-budget", message: "稟議申請に失敗しました" });
        });
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>新規稟議申請</DialogTitle>
      <IconButton
        aria-label="close"
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
        <Button variant="contained" sx={{ margin: 2 }} onClick={onClickCreate}>
          作成
        </Button>
      </DialogContent>
    </Dialog>
  );
};
