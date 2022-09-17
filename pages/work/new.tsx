import {
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import MarkdownEditor from "../../components/Common/MarkdownEditor";
import FileKindIcon from "../../components/File/FileKindIcon";
import { useAuthState } from "../../hook/useAuthState";
import { useWorks } from "../../hook/work/useWork";
import { FileObject, getFileKind } from "../../interfaces/file";
import { WorkRequest } from "../../interfaces/work";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileBrowserModal } from "../../components/File/FileBrowser";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TagMultiSelect from "../../components/work/TagMultiSelect";

const WorkCreatePage = () => {
  const router = useRouter();
  const { createWork } = useWorks();
  const { authState } = useAuthState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);
  const onClickSave = () => {
    const workRequest: WorkRequest = {
      name: name,
      description: description,
      authers: [authState.user.id!],
      tags: tags,
      files: files.map((f) => f.id),
    };
    (async () => {
      const res = await createWork(workRequest);
      if (res === "error") return;
      router.push(`/work/${res}`);
    })();
  };
  const onFileSelectCancel = () => {
    setIsOpenFileBrowser(false);
  };
  const onFileSelected = (f: FileObject) => {
    console.log("selected");
    setIsOpenFileBrowser(false);
    setFiles([...files, f]);
  };
  const [tagInput, setTagInput] = useState("");
  return (
    <Container>
      <Breadcrumbs
        links={[{ text: "Home", href: "/" }, { text: "User", href: "/work" }, { text: "新規作成" }]}
      />
      <Grid>
        <h1>Work新規作成</h1>
        <hr />
      </Grid>
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
        <h3>説明</h3>
        <MarkdownEditor
          value={description}
          onChange={(value) => {
            setDescription(value);
          }}
        />
      </Grid>
      <Grid sx={{ marginTop: 3 }}>
        <h3>ファイル</h3>
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setFiles(files.filter((f) => f.id !== file.id));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              {file ? (
                <>
                  {getFileKind(file.extension) === "image" ? (
                    <img src={file.url} alt="" style={{ height: "100px" }} />
                  ) : (
                    <ListItemIcon>
                      <FileKindIcon kind={getFileKind(file.extension)} />
                    </ListItemIcon>
                  )}
                </>
              ) : (
                <></>
              )}
              <ListItemText>{file.name}</ListItemText>
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
        <h3>タグ</h3>
        {/* 後で岡本さんがどうにかしてくれる → そうか？ */}
        <TagMultiSelect selectedTags={tags} onChange={(tags) => setTags(tags)} />
      </Grid>
      <Grid sx={{ textAlign: "center" }}>
        <Button variant="contained" onClick={onClickSave}>
          save
        </Button>
      </Grid>
    </Container>
  );
};
export default WorkCreatePage;
