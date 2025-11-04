import { useEffect, useState } from "react";

import { Button } from "@mui/material";

import { useMyIntroduction } from "../../../hook/profile/useIntroduction";
import MarkdownEditor from "../../Common/MarkdownEditor";

interface IntroductionStepProps {
  onNext?: () => void;
}

const IntroductionStep = ({ onNext }: IntroductionStepProps) => {
  const [userIntro, updateIntro] = useMyIntroduction();
  const [editUserIntro, setEditUserIntro] = useState<{ md: string }>();
  
  useEffect(() => {
    setEditUserIntro({ md: (" " + userIntro).slice(1) });
  }, [userIntro]);

  if (!editUserIntro) return <p>isLoading...</p>;

  return (
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
        onClick={() => {
          updateIntro(editUserIntro.md);
          if (onNext) onNext();
        }}
      >
        保存
      </Button>
    </div>
  );
};

export default IntroductionStep;
