import { Grid } from "@mui/material";

import DiscordStep from "./editor/DiscordStep";
import IntroductionStep from "./editor/IntroductionStep";
import PrivateProfileStep from "./editor/PrivateProfileStep";
import PublicProfileStep from "./editor/PublicProfileStep";

const ProfileEditor = () => {
  return (
    <>
      <Grid sx={{ mb: 3 }}>
        <h1>プロファイル編集</h1>
        <Grid sx={{ mb: 3 }}>
          <PublicProfileStep />
        </Grid>
        <Grid sx={{ mb: 3 }}>
          <PrivateProfileStep />
        </Grid>
        <Grid sx={{ mb: 3 }}>
          <DiscordStep />
        </Grid>
        <Grid>
          <IntroductionStep />
        </Grid>
      </Grid>
    </>
  );
};

export default ProfileEditor;
