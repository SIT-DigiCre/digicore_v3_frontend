import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();

  router.replace("/user/profile/public");
};

export default ProfilePage;
