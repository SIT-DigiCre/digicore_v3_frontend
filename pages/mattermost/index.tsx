import { useState } from "react";
import { MattermostDisplayPage } from "../../interfaces/mattermost";
import { MattermostAgreement } from "../../components/Mattermost/agreement";
import { MattermostRegister } from "../../components/Mattermost/register";
import { MattermostRegisterComplete } from "../../components/Mattermost/register_complete";

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
