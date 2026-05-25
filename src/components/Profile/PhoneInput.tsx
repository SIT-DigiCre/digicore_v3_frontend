import { useEffect, useState } from "react";

import { Stack, TextField } from "@mui/material";
import { isValidPhoneNumber } from "libphonenumber-js";

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

  const checkIsValid = (value: string) => {
    const cleaned = value.replace(/[-\s]/g, ""); // ハイフンとスペースを削除
    if (cleaned === "") return true;

    if (cleaned.startsWith("+")) {
      return isValidPhoneNumber(cleaned);
    }
    return isValidPhoneNumber(cleaned, "JP");
  };

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
          if (error && checkIsValid(e.target.value)) {
            setError(false);
          }
          setNum(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={() => {
          // ハイフンを削除し、電話番号であるかをチェック
          const cleanedNum = num.replace(/[-\s]/g, "");
          if (!checkIsValid(cleanedNum)) {
            setError(true);
          } else {
            setNum(cleanedNum);
            onChange(cleanedNum);
            setError(false);
          }
        }}
        error={error}
        helperText={
          error
            ? "正しい電話番号の形式で入力してください"
            : "国内番号、または+から始まる国際番号で入力してください"
        }
      />
    </Stack>
  );
};

export default PhoneInput;
