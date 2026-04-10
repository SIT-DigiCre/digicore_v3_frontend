import { useEffect } from "react";

import { useRouter } from "next/router";

const RegisterPublicPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tutorial/public-profile");
  }, [router]);

  return null;
};

export default RegisterPublicPage;
