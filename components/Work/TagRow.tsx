import { useState } from "react";

import { useTheme, Modal, Box, Stack, Button } from "@mui/material";

import { useWorkTagDetail } from "../../hook/work/useWorkTag";

type Props = {
  tagId: string;
  deleteWorkTag: (tagId: string) => void;
};

const TagRow = ({ tagId, deleteWorkTag }: Props) => {
  const tagDetail = useWorkTagDetail(tagId);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const theme = useTheme();
  return tagDetail ? (
    <div style={{ display: "flex", margin: 6, justifyContent: "space-between" }}>
      <div>{tagDetail.name}</div>
      <div>
        <small style={{ marginLeft: "1em", color: theme.palette.text.secondary }}>
          {tagDetail.description}
        </small>
      </div>
      <div>
        <Stack spacing={2} direction="row">
          <Button variant="contained">編集</Button>
          <Button variant="outlined" color="error" onClick={() => setDeleteModal(true)}>
            削除
          </Button>
        </Stack>
      </div>
      <Modal open={deleteModal}>
        <Box style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <Box sx={{bgcolor: "background.paper", p: 4}}>
            本当にタグ {tagDetail.name} を削除してよろしいですか？
            <Button type="submit" variant="contained" color="error" style={{ margin: "1rem" }} onClick={() => {
              deleteWorkTag(tagId);
              setDeleteModal(false);
            }}>
              削除
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteModal(false);
              }}
              style={{ margin: "1rem" }}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  ) : null;
};

export default TagRow;
