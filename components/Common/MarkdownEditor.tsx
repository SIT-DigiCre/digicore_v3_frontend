import { Grid, Button, TextField } from "@mui/material";
import { ChangeEventHandler, useState, useRef, useEffect } from "react";
import { FileObject } from "../../interfaces/file";
import { FileBrowserModal } from "../File/FileBrowser";
import MarkdownView from "./MarkdownView";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};
type MarkdownEditorActionBtn = {
  title: string;
  text: string;
  rtnAdd?: boolean;
};
const markdownEditorActionBtns: MarkdownEditorActionBtn[] = [
  { title: "H2", text: "## 見出し", rtnAdd: true },
  { title: "H3", text: "### 小見出し", rtnAdd: true },
  { title: "H4", text: "#### めっちゃ小見出し", rtnAdd: true },
  { title: "B", text: "**強調**" },
  { title: "I", text: "*Italic*" },
  { title: "・", text: "- 箇条書き", rtnAdd: true },
  { title: "1.", text: "1. 番号付きリスト", rtnAdd: true },
  { title: "LINK", text: "[Google](https://google.co.jp)", rtnAdd: true },
];

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const textFieldElement = useRef<HTMLTextAreaElement>(null);
  const mdPreviewDivElement = useRef<HTMLDivElement>(null);
  const [md, setMd] = useState("");
  useEffect(() => {
    setMd(value);
  }, [value]);
  const onChangeMd: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMd(e.target.value);
    onChange(e.target.value);
  };
  const onScrollTextField = () => {
    mdPreviewDivElement.current.scrollTop =
      (mdPreviewDivElement.current.scrollHeight * textFieldElement.current.scrollTop) /
      (textFieldElement.current.scrollHeight - textFieldElement.current.clientHeight);
  };
  const [selectStart, setSelectStart] = useState(0);
  const insertText = (text: string, rtnAdd?: boolean) => {
    const midText = (rtnAdd ? "\n" : "") + text;
    const newText = md.substring(0, selectStart) + midText + md.substring(selectStart);
    setMd(newText);
    setSelectStart(selectStart + midText.length);
  };
  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);
  const onFileSelected = (file: FileObject) => {
    console.log(file);
    setIsOpenFileBrowser(false);
    insertText(`![${file.name}](${file.url})`, true);
  };
  return (
    <>
      <Grid container>
        <Grid item xs={12} sx={{ marginBottom: "0.5rem" }}>
          {markdownEditorActionBtns.map((btn) => (
            <Button
              onClick={() => insertText(btn.text, btn.rtnAdd)}
              variant="contained"
              sx={{ marginRight: "0.5rem" }}
            >
              {btn.title}
            </Button>
          ))}
          <Button
            onClick={() => {
              setIsOpenFileBrowser(true);
            }}
            variant="contained"
            sx={{ marginRight: "0.5rem" }}
          >
            画像
          </Button>
          <FileBrowserModal
            open={isOpenFileBrowser}
            onCancel={() => {
              setIsOpenFileBrowser(false);
            }}
            onSelected={onFileSelected}
            onlyFileKind="image"
          />
        </Grid>
        <Grid item xs={6}>
          <Grid>
            <textarea
              rows={20}
              value={md}
              onChange={onChangeMd}
              ref={textFieldElement}
              onScroll={onScrollTextField}
              style={{ height: 500, width: "100%", fontSize: 18, paddingLeft: "2px" }}
              onClick={() => {
                setSelectStart(textFieldElement.current.selectionStart);
              }}
              onKeyDown={() => {
                setSelectStart(textFieldElement.current.selectionStart);
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid
            sx={{
              overflowY: "auto",
              overflowWrap: "break-word",
              marginLeft: "0.5rem",
              border: "black 1px solid",
              background: "rgba(0,0,0,0.1)",
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
