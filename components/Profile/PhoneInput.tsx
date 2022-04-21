import { TextField } from "@mui/material";
import { useState } from "react";

type Props = {
  title: string;
  onChange: (phoneNumber: string) => void;
  initPhoneNumber?: string;
  required?: boolean;
};
const PhoneInput = ({ title, onChange, initPhoneNumber, required }: Props) => {
  const [num0, setNum0] = useState(initPhoneNumber ? initPhoneNumber.split("-")[0] : "");
  const [num1, setNum1] = useState(initPhoneNumber ? initPhoneNumber.split("-")[1] : "");
  const [num2, setNum2] = useState(initPhoneNumber ? initPhoneNumber.split("-")[2] : "");

  return (
    <>
      <h5>{title}</h5>
      <TextField
        label="090"
        variant="outlined"
        required={required}
        margin="normal"
        type="number"
        value={num0}
        onChange={(e) => {
          setNum0(e.target.value);
          onChange(`${e.target.value}-${num1}-${num2}`);
        }}
      />
      <TextField
        label="1234"
        variant="outlined"
        required={required}
        margin="normal"
        type="number"
        value={num1}
        onChange={(e) => {
          setNum1(e.target.value);
          onChange(`${num0}-${e.target.value}-${num2}`);
        }}
      />
      <TextField
        label="5678"
        variant="outlined"
        required={required}
        margin="normal"
        type="number"
        value={num2}
        onChange={(e) => {
          setNum2(e.target.value);
          onChange(`${num0}-${num1}-${e.target.value}`);
        }}
      />
    </>
  );
};

export default PhoneInput;
