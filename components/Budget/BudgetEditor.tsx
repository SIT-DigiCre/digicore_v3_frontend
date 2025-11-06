import { Dispatch, SetStateAction, useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
} from "@mui/material";

import { BudgetDetail, BudgetStatus, PutBudgetRequest } from "../../interfaces/budget";
import { FileObject } from "../../interfaces/file";
import Heading from "../Common/Heading";
import { FileBrowserModal } from "../File/FileBrowser";

import BudgetListItem from "./BudgetListItem";

type Props = {
  onSubmit: (budget: PutBudgetRequest) => void;
  initBudget?: BudgetDetail;
};

type Fields = "name" | "purpose" | "budget" | "settlement" | "mattermostUrl" | "remark" | "files";

type FieldFlags = {
  [K in Fields]?: boolean;
};

type ValidationErrors = {
  [K in Fields]?: string;
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

const BudgetEditor = ({ onSubmit, initBudget }: Props) => {
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
    <>
      <Grid sx={{ marginTop: 3 }}>
        <Heading level={3}>基本情報</Heading>
      </Grid>
      {editableFields[initBudget.status].name ? (
        <Grid sx={{ marginTop: 3 }}>
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
        </Grid>
      ) : (
        <Grid sx={{ marginTop: 3 }}>
          <p>稟議名: {name}</p>
        </Grid>
      )}
      {editableFields[initBudget.status].purpose ? (
        <Grid sx={{ marginTop: 3 }}>
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
        </Grid>
      ) : initBudget.class === "festival" || initBudget.class === "fixed" ? (
        // 学園祭費または固定費用のときは省略する
        <></>
      ) : (
        <Grid sx={{ marginTop: 3 }}>
          <p>利用目的: {purpose}</p>
        </Grid>
      )}
      {editableFields[initBudget.status].mattermostUrl ? (
        <Grid sx={{ marginTop: 3 }}>
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
        </Grid>
      ) : (
        <></>
      )}

      <Divider sx={{ marginTop: 3 }} />

      <Grid sx={{ marginTop: 3 }}>
        <Heading level={3}>金額</Heading>
      </Grid>
      {editableFields[initBudget.status].budget ? (
        <Grid sx={{ marginTop: 3 }}>
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
        </Grid>
      ) : initBudget.class === "festival" || initBudget.class === "fixed" ? (
        // 学園祭費または固定費用の場合は省略する
        <></>
      ) : (
        <Grid sx={{ marginTop: 3 }}>
          <p>予定金額: {budgetStr} 円</p>
        </Grid>
      )}
      {editableFields[initBudget.status].settlement ? (
        <Grid sx={{ marginTop: 3 }}>
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
        </Grid>
      ) : initBudget.status === "paid" ? (
        <Grid sx={{ marginTop: 3 }}>
          <p>購入金額: {settlementStr} 円</p>
        </Grid>
      ) : (
        <></>
      )}

      <Divider sx={{ marginTop: 3 }} />

      <Grid sx={{ marginTop: 3 }}>
        <Heading level={3}>備考</Heading>
      </Grid>
      {editableFields[initBudget.status].remark ? (
        <Grid sx={{ marginTop: 3 }}>
          <TextField
            fullWidth
            label="備考"
            defaultValue=""
            value={remark}
            onChange={(e) => {
              handleOnChange("remark", setRemark, e.target.value);
            }}
          />
        </Grid>
      ) : (
        <></>
      )}
      {editableFields[initBudget.status].files ? (
        <>
          <Divider sx={{ marginTop: 3 }} />

          <Grid sx={{ marginTop: 3 }}>
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
                  {fileId ? <BudgetListItem fileId={fileId} /> : <></>}
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              onClick={() => {
                setIsOpenFileBrowser(true);
              }}
            >
              ファイルの追加
            </Button>
            <FileBrowserModal
              open={isOpenFileBrowser}
              onCancel={onFileSelectCancel}
              onSelected={onFileSelected}
            />
          </Grid>
        </>
      ) : (
        <></>
      )}
      <Grid sx={{ marginTop: 6, marginBottom: 3, textAlign: "center" }}>
        {initBudget.status === "reject" ? (
          <p>この稟議は却下されているため、これ以上編集することができません。</p>
        ) : (
          <Button variant="contained" onClick={onClickSave} disabled={!isAllValid}>
            save
          </Button>
        )}
      </Grid>
    </>
  );
};

export default BudgetEditor;
