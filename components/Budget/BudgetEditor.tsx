import { Dispatch, SetStateAction, useEffect, useState } from "react";

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

import { BudgetStatus, PutBudgetRequest } from "../../interfaces/budget";
import { FileObject } from "../../interfaces/file";
import Heading from "../Common/Heading";
import { FileBrowserModal } from "../File/FileBrowser";

import BudgetListItem from "./BudgetListItem";

import type { paths } from "../../utils/fetch/api.d";

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
  initBudget?: BudgetDetailResponse;
};

// status毎の編集可能なフィールドを定義 (trueで編集可能を表す)
const editableFields: {
  [K in BudgetStatus]: FieldFlags;
} = {
  pending: {
    name: true,
    purpose: true,
    budget: true,
    mattermostUrl: true,
    remark: true,
  },
  approve: {
    settlement: true,
    remark: true,
    files: true,
  },
  bought: {
    settlement: true,
    remark: true,
    files: true,
  },
  paid: {
    remark: true,
  },
  reject: {},
};

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

  // 入力可能な必須項目がすべて valid のとき true
  const isAllValid =
    (!editableFields[initBudget.status].name || validateField("name", name) === true) &&
    (!editableFields[initBudget.status].purpose || validateField("purpose", purpose) === true) &&
    (!editableFields[initBudget.status].budget || validateField("budget", budgetStr) === true) &&
    (!editableFields[initBudget.status].settlement ||
      validateField("settlement", settlementStr) === true);

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
      name,
      purpose,
      mattermostUrl,
      budget: parseInt(budgetStr),
      settlement: parseInt(settlementStr),
      remark,
      files,
      bought: false,
    };
    onSubmit(budgetRequest);
  };

  return (
    <Stack spacing={2} my={2}>
      <Box>
        <Heading level={3}>稟議名</Heading>
        {editableFields[initBudget.status].name ? (
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
          {editableFields[initBudget.status].purpose ? (
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
      {editableFields[initBudget.status].mattermostUrl && (
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
          {editableFields[initBudget.status].budget ? (
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
      {(initBudget.class === "festival" || initBudget.class === "fixed") && (
        <Box>
          <Heading level={3}>購入金額</Heading>
          {editableFields[initBudget.status].settlement ? (
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
          ) : (
            initBudget.status === "paid" && <Typography>購入金額: {settlementStr} 円</Typography>
          )}
        </Box>
      )}
      {editableFields[initBudget.status].remark && (
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
      {editableFields[initBudget.status].files && (
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
      <Box sx={{ marginTop: 6, marginBottom: 3, textAlign: "center" }}>
        {initBudget.status === "reject" ? (
          <p>この稟議は却下されているため、これ以上編集することができません。</p>
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
