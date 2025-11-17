import { useEffect, useState } from "react";

import { Button } from "@mui/material";

import Heading from "../../../components/Common/Heading";
import MarkdownEditor from "../../../components/Common/MarkdownEditor";
import EditorTabLayout from "../../../components/Profile/EditorTabLayout";
import { useMyIntroduction } from "../../../hook/profile/useIntroduction";
import { useAuthState } from "../../../hook/useAuthState";

const IntroductionProfilePage = () => {
  const { authState } = useAuthState();
  const [userIntro, updateIntro] = useMyIntroduction();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>();

  useEffect(() => {
    setEditUserIntro({ md: (" " + userIntro).slice(1) });
  }, [userIntro]);

  const handleSave = () => {
    if (editUserIntro) {
      updateIntro(editUserIntro.md);
    }
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!editUserIntro) return <p>isLoading...</p>;

  return (
    <EditorTabLayout>
      <div>
        <Heading level={2}>自己紹介ページ文章</Heading>
        <MarkdownEditor
          value={editUserIntro.md}
          onChange={(e) => {
            setEditUserIntro({ md: e });
          }}
        />
        <Button
          variant="contained"
          disabled={userIntro === editUserIntro.md}
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          保存
        </Button>
      </div>
    </EditorTabLayout>
  );
};

export default IntroductionProfilePage;
