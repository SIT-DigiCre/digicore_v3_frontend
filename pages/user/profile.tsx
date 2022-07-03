import { Button, Container, Grid, TextField, Typography, Alert } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import NameInput from "../../components/Profile/NameInput";
import PhoneInput from "../../components/Profile/PhoneInput";
import ProfileRegister from "../../components/Profile/ProfileRegister";
import { useAuthState } from "../../hook/useAuthState";
import { User } from "../../interfaces";
import { convertUserPrivateFromUser, convertUserProfileFromUser } from "../../interfaces/api";
import { axios } from "../../utils/axios";
import { baseURL } from "../../utils/common";

type Props = {
  registerMode: boolean;
};
const ProfilePage = ({ registerMode }: Props) => {
  const router = useRouter();
  const { authState } = useAuthState();

  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <Container sx={{ mx: 5, my: 3 }}>
          {registerMode ? <ProfileRegister registerMode={registerMode} /> : <></>}
        </Container>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { register } = context.query;
  let registerMode = false;
  if (typeof register === "string") registerMode = register === "true";
  const props: Props = { registerMode: registerMode };
  return {
    props: props,
  };
};
export default ProfilePage;
