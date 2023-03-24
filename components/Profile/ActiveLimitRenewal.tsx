import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import { useActiveLimit } from "../../hook/profile/useActiveLimit";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { useMyProfile } from "../../hook/profile/useProfile";
import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";
import NameInput from "./NameInput";
import PhoneInput from "./PhoneInput";

const ActiveLimitRenewal = () => {
  const [activeLimit,updateActiveLimit] = useActiveLimit();

  return (
    <>
        {activeLimit}
      <br />
      <Button
        variant="contained"
        onClick={() => {updateActiveLimit().then((()=>router.reload()))}}
        sx={{ mt: 2 }}
      >
        有効期限の更新
      </Button>
    </>
  );
};

export default ActiveLimitRenewal;
