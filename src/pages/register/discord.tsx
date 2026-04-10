import { useEffect } from "react";

import { useRouter } from "next/router";

const RegisterDiscordPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tutorial/discord");
  }, [router]);

  return null;
};

export default RegisterDiscordPage;
