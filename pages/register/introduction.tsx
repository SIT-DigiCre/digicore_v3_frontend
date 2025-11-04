import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import MarkdownEditor from "../../components/Common/MarkdownEditor";
import RegisterStepLayout from "../../components/Profile/RegisterStepLayout";
import { useMyIntroduction } from "../../hook/profile/useIntroduction";
import { useAuthState } from "../../hook/useAuthState";

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
    router.push("/register/joined");
  };

  const handlePrev = () => {
    router.push("/register/discord");
  };

  if (authState.isLoading || !authState.isLogined) {
    return <p>読み込み中...</p>;
  }

  if (!editUserIntro) return <p>isLoading...</p>;

  return (
    <RegisterStepLayout
      title="プロフィール登録"
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
    </RegisterStepLayout>
  );
};

export default RegisterIntroductionProfilePage;
