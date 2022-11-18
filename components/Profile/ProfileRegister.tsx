import { Button, Container, Grid, TextField, Typography, Alert } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import NameInput from "../../components/Profile/NameInput";
import PhoneInput from "../../components/Profile/PhoneInput";
import { useAuthState } from "../../hook/useAuthState";
import { FullUser } from "../../interfaces/user";
import { axios } from "../../utils/axios";
import { baseURL } from "../../utils/common";

type Props = {
  registerMode: boolean;
};
const ProfileRegister = ({ registerMode }: Props) => {
  const router = useRouter();
  const { authState } = useAuthState();

  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <Container sx={{ mx: 5, my: 3 }}>
          <p>工事中</p>
        </Container>
      )}
    </>
  );
};
export default ProfileRegister;
