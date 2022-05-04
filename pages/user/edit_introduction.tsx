import { Container, Grid } from "@mui/material";
import { useCallback, useState, useMemo } from "react";
import useSWR from "swr";
import MarkdownEditor from "../../components/Common/MarkdownEditor";

const EditIntroductionPage = () => {
  //const { data, error } = useSWR("/user/my/private");
  const [introMd, setIntroMd] = useState("");
  const [introEditMd, setIntroEditMd] = useState("");
  //if (!data) return <p>Loading</p>;
  return (
    <Container>
      <Grid>
        <h2>自己紹介編集</h2>
        <MarkdownEditor
          value={introEditMd}
          onChange={(changeValue) => {
            setIntroEditMd(changeValue);
          }}
        />
      </Grid>
    </Container>
  );
};

export default EditIntroductionPage;
