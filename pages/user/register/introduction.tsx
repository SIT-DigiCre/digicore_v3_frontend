import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Button } from "@mui/material";

import ProfileTabLayout from "../../../components/Profile/ProfileTabLayout";
import MarkdownEditor from "../../../components/Common/MarkdownEditor";
import { useAuthState } from "../../../hook/useAuthState";
import { useMyIntroduction } from "../../../hook/profile/useIntroduction";

const RegisterIntroductionProfilePage = () => {
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

  const handleNext = () => {
    if (editUserIntro) {
      updateIntro(editUserIntro.md);
    }
    // 登録完了処理
    sessionStorage.setItem("register", "true");
    router.push("/user/joined");
  };

  const handlePrev = () => {
    router.push("/user/register/discord");
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!editUserIntro) return <p>isLoading...</p>;

  return (
    <ProfileTabLayout 
      isRegisterMode={true} 
      title="プロフィール登録"
      showNavigation={true}
      onNext={handleNext}
      onPrev={handlePrev}
      nextDisabled={false}
    >
      <div>
        <h2>自己紹介ページ文章</h2>
        <MarkdownEditor
          value={editUserIntro.md}
          onChange={(e) => {
            setEditUserIntro({ md: e });
          }}
        />
      </div>
    </ProfileTabLayout>
  );
};

export default RegisterIntroductionProfilePage;
