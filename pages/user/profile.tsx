import { Button } from "@mui/material";
import { useAuthState } from "../../hook/useAuthState";
import { baseURL } from "../../utils/common";

const ProfilePage = () => {
  const { authState } = useAuthState();
  return (
    <>
      {authState.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Button href={baseURL + "/discord/oauth/url"} variant="contained">
            {authState.user.discordUserId == "" ? "Discord連携" : "Discord再連携"}
          </Button>
        </>
      )}
    </>
  );
};

export default ProfilePage;
