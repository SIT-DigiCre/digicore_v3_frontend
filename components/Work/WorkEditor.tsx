import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid, IconButton, List, ListItem, TextField } from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { FileObject } from "../../interfaces/file";
import { WorkDetail, WorkRequest } from "../../interfaces/work";
import Heading from "../Common/Heading";
import MarkdownEditor from "../Common/MarkdownEditor";
import { FileBrowserModal } from "../File/FileBrowser";

import TagMultiSelect from "./TagMultiSelect";
import WorkListItem from "./WorkListItem";

type Props = {
  onSubmit: (work: WorkRequest) => void;
  initWork?: WorkDetail;
};

const WorkEditor = ({ onSubmit, initWork }: Props) => {
  const { authState } = useAuthState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => {
    if (!initWork) return;
    setName(initWork.name);
    setDescription(initWork.description);
    setTags(initWork.tags ? initWork.tags.map((t) => t.tagId) : []);
    setFiles(initWork.files ? initWork.files.map((f) => f.fileId) : []);
  }, [initWork]);
  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);

  const onFileSelectCancel = () => {
    setIsOpenFileBrowser(false);
  };
  const onFileSelected = (f: FileObject) => {
    setIsOpenFileBrowser(false);
    setFiles([...files, f.fileId]);
  };
  const onClickSave = () => {
    const workRequest: WorkRequest = {
      name: name,
      description: description,
      authors: [authState.user.userId!],
      tags: tags,
      files: files,
    };
    onSubmit(workRequest);
  };
  return (
    <>
      <Grid sx={{ marginTop: 3 }}>
        <TextField
          required
          label="Work名"
          defaultValue=""
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        <Heading level={3}>説明</Heading>
        <MarkdownEditor
          value={description}
          onChange={(value) => {
            setDescription(value);
          }}
        />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        <Heading level={3}>ファイル</Heading>
        <List>
          {files.map((fileId) => (
            <ListItem
              key={fileId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setFiles(files.filter((f) => f !== fileId));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              {fileId ? <WorkListItem fileId={fileId} /> : <></>}
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          onClick={() => {
            setIsOpenFileBrowser(true);
          }}
        >
          ファイルの追加
        </Button>
        <FileBrowserModal
          open={isOpenFileBrowser}
          onCancel={onFileSelectCancel}
          onSelected={onFileSelected}
        />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        <Heading level={3}>タグ</Heading>
        {/* 後で岡本さんがどうにかしてくれる → そうか？ →　そうだった！ */}
        <TagMultiSelect selectedTags={tags} onChange={(tags) => setTags(tags)} />
      </Grid>
      <Grid sx={{ textAlign: "center" }}>
        <Button variant="contained" onClick={onClickSave} disabled={!description || !name}>
          save
        </Button>
      </Grid>
    </>
  );
};

export default WorkEditor;
