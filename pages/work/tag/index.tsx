import { useState } from "react";
import { Container, Modal, Stack, Box, Button, TextField } from "@mui/material";
import { useWorkTags } from "../../../hook/work/useWorkTag";
import TagRow from "../../../components/Work/TagRow";
import { WorkTagUpdate } from "../../../interfaces/work";
import PageHead from "../../../components/Common/PageHead";

const WorkTagIndexPage = () => {
  const [createModal, setCreateModal] = useState(false);
  const [newTag, setNewTag] = useState<WorkTagUpdate>({ name: "", description: "" });
  const { workTags, createWorkTag, deleteWorkTag } = useWorkTags();
  const editTag = () => {};

  return (
    <Container>
      <PageHead title="WorkTag一覧" />
      <div>
        <div>
          <Button variant="contained" onClick={() => setCreateModal(true)}>
            新規作成
          </Button>
        </div>
        <div>
          {workTags.map((WorkTag) => (
            <TagRow tagId={WorkTag.tagId} deleteWorkTag={deleteWorkTag} />
          ))}
        </div>
      </div>

      <Modal open={createModal}>
        <Box style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <Box sx={{ bgcolor: "background.paper", p: 4 }}>
            <TextField
              label="タグ名"
              variant="outlined"
              required
              margin="normal"
              fullWidth
              value={newTag.name}
              onChange={(e) => {
                setNewTag({ ...newTag, name: e.target.value });
              }}
            />
            <TextField
              label="説明"
              variant="outlined"
              required
              margin="normal"
              fullWidth
              value={newTag.description}
              onChange={(e) => {
                setNewTag({ ...newTag, description: e.target.value });
              }}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ margin: "1rem" }}
              onClick={() => {
                createWorkTag(newTag.name, newTag.description);
                setCreateModal(false);
              }}
            >
              作成
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setCreateModal(false);
              }}
              style={{ margin: "1rem" }}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default WorkTagIndexPage;
