import { useEffect } from "react";

import { useRouter } from "next/router";

const RegisterIntroductionPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tutorial/introduction");
  }, [router]);

  return null;
};

export default RegisterIntroductionPage;
