import { useEffect } from "react";

import { useRouter } from "next/router";

const RegisterPersonalPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tutorial/personal-info");
  }, [router]);

  return null;
};

export default RegisterPersonalPage;
