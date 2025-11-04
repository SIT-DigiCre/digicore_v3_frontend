import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Button } from "@mui/material";

import ProfileTabLayout from "../../../components/Profile/ProfileTabLayout";
import MarkdownEditor from "../../../components/Common/MarkdownEditor";
import { useAuthState } from "../../../hook/useAuthState";
import { useMyIntroduction } from "../../../hook/profile/useIntroduction";

const IntroductionProfilePage = () => {
  const router = useRouter();
  const { authState } = useAuthState();
  const [userIntro, updateIntro] = useMyIntroduction();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>();

  useEffect(() => {
    if (!authState.isLoading && !authState.isLogined) {
      router.push("/login");
    }
  }, [authState, router]);

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
    <ProfileTabLayout>
      <div>
        <h2>自己紹介ページ文章</h2>
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
    </ProfileTabLayout>
  );
};

export default IntroductionProfilePage;
