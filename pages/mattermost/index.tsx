import { Typography } from "@mui/material";

const MatatermostIndex = () => {
  return (
    <Typography>
      既存生向けのMattermost登録は終了しました。個別に幹部にお問い合わせください。
    </Typography>
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
