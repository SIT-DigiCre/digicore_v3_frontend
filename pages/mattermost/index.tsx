import { useState } from "react";
import { MattermostDisplayPage } from "../../interfaces/mattermost";
import { MattermostAgreement } from "../../components/Mattermost/Agreement";
import { MattermostRegister } from "../../components/Mattermost/Register";
import { MattermostRegisterComplete } from "../../components/Mattermost/RegisterComplete";

const MatatermostIndex = () => {
  const [displayPage, setDisplayPage] = useState<MattermostDisplayPage>("agreement");
  if (displayPage === "agreement") {
    return <MattermostAgreement displayPageSetter={setDisplayPage} />;
  } else if (displayPage === "register") {
    return <MattermostRegister displayPageSetter={setDisplayPage} />;
  } else if (displayPage === "complete") {
    return <MattermostRegisterComplete />;
  }
};

export default MatatermostIndex;
