import { TextField } from "@mui/material";
import { useState } from "react";

type Props = {
  title: string;
  onChange: (firstName: string, lastName: string) => void;
  firstNameTitle: string;
  lastNameTitle: string;
  initFirstName?: string;
  initLastName?: string;
};
const NameInput = ({
  title,
  onChange,
  firstNameTitle,
  lastNameTitle,
  initFirstName,
  initLastName,
}: Props) => {
  const [firstName, setFirstName] = useState(initFirstName ? initFirstName : "");
  const [lastName, setLastName] = useState(initLastName ? initLastName : "");

  return (
    <>
      <h5>{title}</h5>
      <TextField
        label={firstNameTitle}
        variant="outlined"
        required
        margin="normal"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          onChange(e.target.value, lastName);
        }}
      />
      <TextField
        label={lastNameTitle}
        variant="outlined"
        required
        margin="normal"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          onChange(firstName, e.target.value);
        }}
      />
    </>
  );
};

export default NameInput;
