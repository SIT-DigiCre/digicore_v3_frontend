import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Add, Save } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { BudgetStatus, PutBudgetRequest } from "../../interfaces/budget";
import type { FileObject } from "../../interfaces/file";
import type { paths } from "../../utils/fetch/api.d";

import Heading from "../Common/Heading";
import { FileBrowserModal } from "../File/FileBrowser";
import BudgetListItem from "./BudgetListItem";

type BudgetDetailResponse =
  paths["/budget/{budgetId}"]["get"]["responses"]["200"]["content"]["application/json"];

type Fields = "name" | "purpose" | "budget" | "settlement" | "mattermostUrl" | "remark" | "files";

type FieldFlags = {
  [K in Fields]?: boolean;
};

type ValidationErrors = {
  [K in Fields]?: string;
};

type BudgetEditorProps = {
  onSubmit: (budget: PutBudgetRequest) => void;
  initBudget: BudgetDetailResponse;
};

// status毎の編集可能なフィールドを定義 (trueで編集可能を表す)
const editableFields: {
  [K in BudgetStatus]: FieldFlags;
} = {
  approve: {
    files: true,
    remark: true,
    settlement: true,
  },
  bought: {
    files: true,
    remark: true,
    settlement: true,
  },
  paid: {
    remark: true,
  },
  pending: {
    budget: true,
    mattermostUrl: true,
    name: true,
    purpose: true,
    remark: true,
  },
  reject: {},
} as const;

const isFilled = (s?: string) => {
  if (!s) return false;
  if (s === "") return false;
  return true;
};

const isInt = (s?: string) => {
  if (!s) return false;
  return /^-?\d+$/.test(s);
};

const BudgetEditor = ({ onSubmit, initBudget }: BudgetEditorProps) => {
  const [name, setName] = useState("");
  const [budgetStr, setBudgetStr] = useState("");
  const [mattermostUrl, setMattermostUrl] = useState("");
  const [purpose, setPurpose] = useState("");
  const [remark, setRemark] = useState("");
  const [settlementStr, setSettlementStr] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!initBudget) return;
    setName(initBudget.name);
    setBudgetStr(initBudget.budget === 0 ? "" : initBudget.budget.toString());
    setMattermostUrl(initBudget.mattermostUrl);
    setPurpose(initBudget.purpose);
    setRemark(initBudget.remark);
    setSettlementStr(initBudget.settlement.toString());
    setFiles(initBudget.files ? initBudget.files.map((f) => f.fileId) : []);
  }, [initBudget]);
  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);

  // validator
  const [errors, setErrors] = useState<ValidationErrors>({});
  const validateField = (field: Fields, value: string): boolean | string => {
    switch (field) {
      case "name":
        if (!isFilled(value)) return "必須項目です";
        break;
      case "purpose":
        if (!isFilled(value)) return "必須項目です";
        break;
      case "budget":
        // OpenAPI の validator は "validate: required" を指定した場合 0 を許容しない
        if (!isFilled(value)) return "必須項目です";
        if (!isInt(value)) return "値は 1 以上の整数である必要があります";
        if (parseInt(value) < 1) return "値は 1 以上の整数である必要があります";
        break;
      case "settlement":
        if (!isFilled(value)) return "必須項目です";
        if (!isInt(value)) return "値は 0 以上の整数である必要があります";
        if (parseInt(value) < 0) return "値は 0 以上の整数である必要があります";
        break;
      default:
        break;
    }
    return true;
  };

  const handleOnChange = (
    field: Fields,
    setState: Dispatch<SetStateAction<typeof value>>,
    value: string,
  ) => {
    setState(value);

    const result = validateField(field, value);
    if (typeof result === "string") {
      setErrors({ ...errors, [field]: result });
    } else {
      setErrors({ ...errors, [field]: null });
    }
  };

  const currentField = editableFields[initBudget.status as keyof typeof editableFields];

  // 入力可能な必須項目がすべて valid のとき true
  const isAllValid =
    (!currentField.name || validateField("name", name) === true) &&
    (!currentField.purpose || validateField("purpose", purpose) === true) &&
    (!currentField.budget || validateField("budget", budgetStr) === true) &&
    (!currentField.settlement || validateField("settlement", settlementStr) === true);

  const onFileSelectCancel = () => {
    setIsOpenFileBrowser(false);
  };

  const onFileSelected = (f: FileObject) => {
    setIsOpenFileBrowser(false);
    setFiles([...files, f.fileId]);
  };

  const onClickSave = () => {
    if (!isAllValid) return;

    const budgetRequest: PutBudgetRequest = {
      bought: false,
      budget: parseInt(budgetStr),
      files,
      mattermostUrl,
      name,
      purpose,
      remark,
      settlement: parseInt(settlementStr),
    };
    onSubmit(budgetRequest);
  };

  return (
    <Stack spacing={2} my={2}>
      <Box>
        <Heading level={3}>稟議名</Heading>
        {currentField.name ? (
          <TextField
            required
            label="稟議名"
            defaultValue=""
            value={name}
            helperText={errors.name}
            error={!!errors.name}
            onChange={(e) => {
              handleOnChange("name", setName, e.target.value);
            }}
          />
        ) : (
          <Typography>{name}</Typography>
        )}
      </Box>
      {initBudget.class !== "festival" && initBudget.class !== "fixed" && (
        // 学園祭費または固定費用のときは省略する
        <Box>
          <Heading level={3}>利用目的</Heading>
          {currentField.purpose ? (
            <TextField
              required
              fullWidth
              label="利用目的"
              defaultValue=""
              value={purpose}
              helperText={errors.purpose}
              error={!!errors.purpose}
              onChange={(e) => {
                handleOnChange("purpose", setPurpose, e.target.value);
              }}
            />
          ) : (
            <Typography>{purpose}</Typography>
          )}
        </Box>
      )}
      {currentField.mattermostUrl && (
        <Box>
          <Heading level={3}>MattermostのURL</Heading>
          <TextField
            fullWidth
            label="MattermostのURL"
            helperText="~会計チャンネルのスレッドへのリンクを貼り付けてください"
            defaultValue=""
            value={mattermostUrl}
            onChange={(e) => {
              handleOnChange("mattermostUrl", setMattermostUrl, e.target.value);
            }}
          />
        </Box>
      )}
      {initBudget.class !== "festival" && initBudget.class !== "fixed" && (
        <Box>
          <Heading level={3}>予定金額</Heading>
          {currentField.budget ? (
            <TextField
              required
              type="number"
              label="予定金額"
              InputProps={{
                endAdornment: <InputAdornment position="end">円</InputAdornment>,
              }}
              defaultValue=""
              value={budgetStr}
              helperText={errors.budget}
              error={!!errors.budget}
              onChange={(e) => {
                handleOnChange("budget", setBudgetStr, e.target.value);
              }}
            />
          ) : (
            <Typography>予定金額: {budgetStr} 円</Typography>
          )}
        </Box>
      )}
      <Box>
        <Heading level={3}>購入金額</Heading>
        {currentField.settlement ? (
          <TextField
            required
            type="number"
            label="購入金額"
            InputProps={{
              endAdornment: <InputAdornment position="end">円</InputAdornment>,
            }}
            defaultValue=""
            value={settlementStr}
            helperText={errors.settlement}
            error={!!errors.settlement}
            onChange={(e) => {
              handleOnChange("settlement", setSettlementStr, e.target.value);
            }}
          />
        ) : initBudget.status === "paid" ? (
          <Typography>購入金額: {settlementStr} 円</Typography>
        ) : (
          <Typography>承認後に購入金額を設定してください</Typography>
        )}
      </Box>
      {currentField.remark && (
        <Box>
          <Heading level={3}>備考</Heading>
          <TextField
            fullWidth
            label="備考"
            defaultValue=""
            value={remark}
            onChange={(e) => {
              handleOnChange("remark", setRemark, e.target.value);
            }}
          />
        </Box>
      )}
      {currentField.files && (
        <Box>
          <Heading level={3}>領収書</Heading>
          <List>
            {files.map((fileId) => (
              <ListItem
                key={fileId}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      setFiles(files.filter((f) => f !== fileId));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                {fileId && <BudgetListItem fileId={fileId} />}
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            onClick={() => {
              setIsOpenFileBrowser(true);
            }}
            startIcon={<Add />}
          >
            ファイルの追加
          </Button>
          <FileBrowserModal
            open={isOpenFileBrowser}
            onCancel={onFileSelectCancel}
            onSelected={onFileSelected}
          />
        </Box>
      )}
      <Box sx={{ marginBottom: 3, marginTop: 6, textAlign: "center" }}>
        {initBudget.status === "reject" ? (
          <Typography>この稟議は却下されているため、これ以上編集することができません。</Typography>
        ) : (
          <Button
            variant="contained"
            onClick={onClickSave}
            disabled={!isAllValid}
            startIcon={<Save />}
          >
            保存する
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default BudgetEditor;
