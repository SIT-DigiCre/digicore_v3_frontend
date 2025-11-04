import { useEffect, useState } from "react";

import { TextField, Typography } from "@mui/material";

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
    <>
      <Typography variant="h6">{title}</Typography>
      <TextField
        label="09012345678"
        variant="outlined"
        required={required}
        margin="normal"
        value={num}
        type="tel"
        onChange={(e) => {
          setNum(e.target.value);
          onChange(e.target.value);
        }}
        helperText="ハイフン(-)無しで入力してください"
      />
    </>
  );
};

export default PhoneInput;
