import { Container } from "@mui/material";
import { useState } from "react";
import { useUserProfiles } from "../../hook/user/useUserProfiles";

const UserIndexPage = () => {
  const { userProfiles, requestMoreProfiles } = useUserProfiles();
  return (
    <Container>
      {userProfiles.map((userProfile) => (
        <p>{userProfile.username}</p>
      ))}
      <button
        onClick={() => {
          requestMoreProfiles();
        }}
      >
        update
      </button>
    </Container>
  );
};

export default UserIndexPage;
