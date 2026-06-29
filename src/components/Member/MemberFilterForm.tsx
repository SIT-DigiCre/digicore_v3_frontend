import { Box, TextField } from "@mui/material";

type MemberFilterFormProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
};

export const MemberFilterForm = ({ keyword, onKeywordChange }: MemberFilterFormProps) => {
  return (
    <Box sx={{ maxWidth: 400 }}>
      <TextField
        label="部員名で絞り込み"
        placeholder="部員名を入力..."
        variant="outlined"
        size="small"
        fullWidth
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />
    </Box>
  );
};
