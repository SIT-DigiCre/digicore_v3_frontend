import { useEffect } from "react";

import { useRouter } from "next/router";

const RegisterJoinedPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tutorial/joined-welcome");
  }, [router]);

  return null;
};

export default RegisterJoinedPage;
