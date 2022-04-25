import { TextField } from "@mui/material";
import { useState } from "react";

type Props = {
  title: string;
  onChange: (phoneNumber: string) => void;
  initPhoneNumber?: string;
  required?: boolean;
};
const PhoneInput = ({ title, onChange, initPhoneNumber, required }: Props) => {
  const [num, setNum] = useState(initPhoneNumber ? initPhoneNumber : "");

  return (
    <>
      <h5>{title}</h5>
      <TextField
        label="09012345678"
        variant="outlined"
        required={required}
        margin="normal"
        type="string"
        value={num}
        onChange={(e) => {
          setNum(e.target.value);
          onChange(e.target.value);
        }}
      />
    </>
  );
};

export default PhoneInput;
