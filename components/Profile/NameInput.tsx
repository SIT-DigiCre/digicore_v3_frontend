import { useEffect, useState } from "react";

import { Stack, TextField } from "@mui/material";

type Props = {
  onChange: (firstName: string, lastName: string) => void;
  firstNameTitle: string;
  lastNameTitle: string;
  initFirstName?: string;
  initLastName?: string;
};
const NameInput = ({
  onChange,
  firstNameTitle,
  lastNameTitle,
  initFirstName,
  initLastName,
}: Props) => {
  const [firstName, setFirstName] = useState(initFirstName ? initFirstName : "");
  const [lastName, setLastName] = useState(initLastName ? initLastName : "");
  useEffect(() => {
    setFirstName(initFirstName ?? "");
    setLastName(initLastName ?? "");
  }, [initFirstName, initLastName]);

  return (
    <Stack direction="row" spacing={2}>
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
    </Stack>
  );
};

export default NameInput;
