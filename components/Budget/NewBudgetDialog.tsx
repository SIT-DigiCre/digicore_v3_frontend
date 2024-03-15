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
import { useState } from "react";
import { BudgetClass, CreateBudgetRequest } from "../../interfaces/budget";
import { useErrorState } from "../../hook/useErrorState";
import { useAuthState } from "../../hook/useAuthState";
import { useBudgets } from "../../hook/budget/useBudget";
type Props = {
  open: boolean;
  onClose: () => void;
};
const classList: BudgetClass[] = ["room", "project", "outside", "fixed", "festival"];
export const NewBudgetDialog = ({ open, onClose }: Props) => {
  const [inputName, setInputName] = useState("");
  const [inputClass, setInputClass] = useState<BudgetClass | undefined>();
  const { setNewError } = useErrorState();
  const { authState } = useAuthState();
  const { createBudget } = useBudgets();

  const onClickCreate = () => {
    const name = inputName;
    const className = inputClass;
    if (name == "" || className == undefined) {
      alert("稟議名が空、もしくは種別が指定されていません");
    } else {
      createBudget({ name: name, class: className, proposerUserId: authState.user.userId })
        .then(() => {
          onClose();
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
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      ></IconButton>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ padding: 2 }}>
          <TextField
            label="稟議名"
            variant="outlined"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ padding: 2 }}>
          <InputLabel>種別</InputLabel>
          <Select
            value={inputClass}
            label="種別"
            onChange={(e) => setInputClass(e.target.value as BudgetClass)}
          >
            {classList.map((c) => (
              <MenuItem value={c} key={c}>
                {c}
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
