import { useState, useEffect } from "react";
import { Grid, TextField } from "@mui/material";

import Meishi from "../../components/Meishi/Meishi";
import { standard } from "../../utils/meishi/templates";

const MeishiIndex = () => {
  const [markupText, setMarkupText] = useState("");
  useEffect(() => {
    setMarkupText(standard);
    //setMarkupText("test");
  }, []);
  return (
    <main>
      <Grid>
        <TextField
          label="markup"
          multiline
          rows={5}
          value={markupText}
          onChange={(e) => {
            setMarkupText(e.target.value);
          }}
        />
      </Grid>
      <Grid>{0 < markupText.length ? <Meishi markup={markupText} /> : null}</Grid>
    </main>
  );
};

export default MeishiIndex;
