import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

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
      <h5>{title}</h5>
      <TextField
        label="09012345678"
        variant="outlined"
        required={required}
        margin="normal"
        type="number"
        value={num}
        onWheel={(e) => {
          (e.target as any).blur(); // なんかVSCodeでblurというTypeが存在しないとエラーが出るけど動くのでヨシ！
        }}
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
