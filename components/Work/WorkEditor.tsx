import { useEffect, useState } from "react";

import { Add, Save } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, List, ListItem, Stack, TextField } from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { FileObject } from "../../interfaces/file";
import type { WorkAuthor, WorkDetail, WorkRequest } from "../../interfaces/work";
import Heading from "../Common/Heading";
import { FileBrowserModal } from "../File/FileBrowser";
import MarkdownEditor from "../Markdown/MarkdownEditor";

import AuthorMultiSelect from "./AuthorMultiSelect";
import TagMultiSelect from "./TagMultiSelect";
import WorkListItem from "./WorkListItem";

type WorkEditorProps = {
  onSubmit: (work: WorkRequest) => void;
  initWork?: WorkDetail;
};

const WorkEditor = ({ onSubmit, initWork }: WorkEditorProps) => {
  const { authState } = useAuthState();
  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);

  useEffect(() => {
    if (!initWork) {
      setAuthorIds([authState.user.userId!]);
      return;
    }
    setAuthorIds(initWork.authors.map((a) => a.userId));
    setName(initWork.name);
    setDescription(initWork.description);
    setTags(initWork.tags ? initWork.tags.map((t) => t.tagId) : []);
    setFiles(initWork.files ? initWork.files.map((f) => f.fileId) : []);
  }, [initWork]);

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
      authors: authorIds,
      tags: tags,
      files: files,
    };
    onSubmit(workRequest);
  };

  const currentUser: WorkAuthor = {
    userId: authState.user.userId,
    username: authState.user.username,
    iconUrl: authState.user.iconUrl,
  };

  return (
    <Stack spacing={2} my={2}>
      <Box>
        <Heading level={3}>作者</Heading>
        <AuthorMultiSelect
          initAuthors={initWork ? initWork.authors : [currentUser]}
          currentUser={currentUser}
          onChange={(authors) => setAuthorIds(authors)}
        />
      </Box>
      <Box>
        <Heading level={3}>作品名</Heading>
        <TextField
          required
          label="作品名"
          defaultValue=""
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Box>
      <Box>
        <Heading level={3}>ファイル</Heading>
        {files && files.length > 0 && (
          <List>
            {files.map((fileId) => (
              <ListItem
                key={fileId}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="削除する"
                    onClick={() => {
                      setFiles(files.filter((f) => f !== fileId));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <WorkListItem fileId={fileId} />
              </ListItem>
            ))}
          </List>
        )}
        <Button
          variant="contained"
          onClick={() => {
            setIsOpenFileBrowser(true);
          }}
          startIcon={<Add />}
        >
          ファイルを追加する
        </Button>
        <FileBrowserModal
          open={isOpenFileBrowser}
          onCancel={onFileSelectCancel}
          onSelected={onFileSelected}
        />
      </Box>
      <Box>
        <Heading level={3}>タグ</Heading>
        {/* 後で岡本さんがどうにかしてくれる → そうか？ →　そうだった！ */}
        <TagMultiSelect selectedTags={tags} onChange={(tags) => setTags(tags)} />
      </Box>
      <Box>
        <Heading level={3}>作品説明</Heading>
        <MarkdownEditor
          value={description}
          onChange={(value) => {
            setDescription(value);
          }}
        />
      </Box>
      <Stack alignItems="center">
        <Button
          onClick={onClickSave}
          disabled={!description || !name}
          startIcon={<Save />}
          variant="contained"
        >
          保存する
        </Button>
      </Stack>
    </Stack>
  );
};

export default WorkEditor;
