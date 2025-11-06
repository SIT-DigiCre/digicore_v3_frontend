import { useRouter } from "next/router";
import { useEffect } from "react";

import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { useAuthState } from "../../hook/useAuthState";

const ProfileRegister = () => {
  const router = useRouter();
  const { authState } = useAuthState();
  const [privateProfile] = usePrivateProfile();

  useEffect(() => {
    if (!authState.isLogined) return;

    // 入力状況に応じて、適切なタブにリダイレクト
    if (authState.user.username !== authState.user.studentNumber) {
      if (privateProfile.firstName !== "") {
        if (authState.user.discordUserId !== "") {
          // Discord連携済みの場合は自己紹介へ
          router.replace("/register/introduction");
        } else {
          // Discord連携が必要な場合
          router.replace("/register/discord");
        }
      } else {
        // 本人情報が未入力の場合
        router.replace("/register/personal");
      }
    } else {
      // 公開プロフィールから開始
      router.replace("/register/public");
    }
  }, [authState, privateProfile, router]);

  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>リダイレクト中...</p>
        </div>
      )}
    </>
  );
};
export default ProfileRegister;
