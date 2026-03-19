import { useState } from "react";

import { Box, Button, Modal, Stack, useTheme } from "@mui/material";

import { WorkTagDetail } from "../../interfaces/work";

type Props = {
  tagDetail: WorkTagDetail;
  deleteWorkTag: (tagId: string) => void;
};

const TagRow = ({ tagDetail, deleteWorkTag }: Props) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const theme = useTheme();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", margin: 6 }}>
      <div>{tagDetail.name}</div>
      <div>
        <small style={{ color: theme.palette.text.secondary, marginLeft: "1em" }}>
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
        <Box style={{ alignContent: "center", display: "flex", justifyContent: "center" }}>
          <Box sx={{ bgcolor: "background.paper", p: 4 }}>
            本当にタグ {tagDetail.name} を削除してよろしいですか？
            <Button
              type="submit"
              variant="contained"
              color="error"
              style={{ margin: "1rem" }}
              onClick={() => {
                deleteWorkTag(tagDetail.tagId);
                setDeleteModal(false);
              }}
            >
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
  );
};

export default TagRow;
