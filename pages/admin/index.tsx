import { Typography } from "@mui/material";

import PageHead from "../../components/Common/PageHead";

const AdminPage = () => {
  return (
    <>
      <PageHead title="管理者ページ" />
      <Typography>このページは幹部およびインフラ担当のみが閲覧できます。</Typography>
    </>
  );
};

export default AdminPage;
