import { useEffect, useState } from "react";

import { Stack, TextField, Typography } from "@mui/material";

type Props = {
  title: string;
  onChange: (phoneNumber: string) => void;
  initPhoneNumber?: string;
  required?: boolean;
};
const PhoneInput = ({ title, onChange, initPhoneNumber, required }: Props) => {
  const [num, setNum] = useState(initPhoneNumber ? initPhoneNumber : "");
  useEffect(() => {
    setNum(initPhoneNumber);
  }, [initPhoneNumber]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
        {title}
      </Typography>
      <TextField
        label={title}
        variant="outlined"
        required={required}
        value={num}
        type="tel"
        onChange={(e) => {
          setNum(e.target.value);
          onChange(e.target.value);
        }}
        helperText="ハイフン(-)無しで入力してください"
      />
    </Stack>
  );
};

export default PhoneInput;
