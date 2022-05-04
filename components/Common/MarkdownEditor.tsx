import { Grid, Button, TextField } from "@mui/material";
import { ChangeEventHandler, useState, useRef } from "react";
import MarkdownView from "./MarkdownView";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const textFieldElement = useRef<HTMLTextAreaElement>(null);
  const mdPreviewDivElement = useRef<HTMLDivElement>(null);
  const [md, setMd] = useState(value);
  const onChangeMd: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMd(e.target.value);
  };
  const onScrollTextField = () => {
    mdPreviewDivElement.current.scrollTop =
      (mdPreviewDivElement.current.scrollHeight * textFieldElement.current.scrollTop) /
      (textFieldElement.current.scrollHeight - textFieldElement.current.clientHeight);
  };
  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Grid height={50}>
            <Button>H2</Button>
            <Button>H3</Button>
            <Button>H4</Button>
          </Grid>
          <Grid>
            <textarea
              rows={20}
              value={md}
              onChange={onChangeMd}
              ref={textFieldElement}
              onScroll={onScrollTextField}
              style={{ height: 500, width: "100%", fontSize: 18 }}
            />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid height={50}></Grid>
          <Grid
            sx={{
              overflowY: "auto",
              overflowWrap: "break-word",
              marginLeft: "0.5rem",
            }}
            height={500}
            component="div"
            ref={mdPreviewDivElement}
          >
            <MarkdownView md={md} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default MarkdownEditor;
