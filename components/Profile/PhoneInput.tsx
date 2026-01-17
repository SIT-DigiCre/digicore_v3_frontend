import { useEffect, useState } from "react";

import { Stack, TextField } from "@mui/material";

import Heading from "../Common/Heading";

type Props = {
  title: string;
  onChange: (phoneNumber: string) => void;
  initialPhoneNumber?: string;
  required?: boolean;
};
const PhoneInput = ({ title, onChange, initialPhoneNumber, required }: Props) => {
  const [num, setNum] = useState(initialPhoneNumber ? initialPhoneNumber : "");
  const [error, setError] = useState(false);
  useEffect(() => {
    setNum(initialPhoneNumber ?? "");
  }, [initialPhoneNumber]);

  return (
    <Stack spacing={2}>
      <Heading level={4}>{title}</Heading>
      <TextField
        label={title}
        variant="outlined"
        required={required}
        value={num}
        type="tel"
        onChange={(e) => {
          if (error && /^\d{10,11}$/.test(e.target.value)) {
            setError(false);
          }
          setNum(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={() => {
          // ハイフンを削除し、電話番号であるかをチェック
          const cleanedNum = num.replace(/-/g, "");
          if (!/^\d{10,11}$/.test(cleanedNum)) {
            setError(true);
          } else {
            onChange(cleanedNum);
            setError(false);
          }
        }}
        error={error}
        helperText={
          error ? "半角数字10桁または11桁で入力してください" : "ハイフン(-)無しで入力してください"
        }
      />
    </Stack>
  );
};

export default PhoneInput;
