import { useState } from "react";

import { Container, Typography } from "@mui/material";

import { MattermostAgreement } from "../../components/Mattermost/Agreement";
import { MattermostRegister } from "../../components/Mattermost/Register";
import { MattermostRegisterComplete } from "../../components/Mattermost/RegisterComplete";
import { MattermostDisplayPage } from "../../interfaces/mattermost";


const MatatermostIndex = () => {
  return (
    <Container>
      <Typography>
        既存生向けのMattermost登録は終了しました。個別に幹部にお問い合わせください。
      </Typography>
    </Container>
  );
  /*const [displayPage, setDisplayPage] = useState<MattermostDisplayPage>("agreement");
  if (displayPage === "agreement") {
    return <MattermostAgreement displayPageSetter={setDisplayPage} />;
  } else if (displayPage === "register") {
    return <MattermostRegister displayPageSetter={setDisplayPage} />;
  } else if (displayPage === "complete") {
    return <MattermostRegisterComplete />;
  }*/
};

export default MatatermostIndex;
