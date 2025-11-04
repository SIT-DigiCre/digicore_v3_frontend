import { useRouter } from "next/router";
import { useEffect } from "react";

const CompletionStep = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/user/joined");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <p>これで登録は完了です。</p>
    </>
  );
};

export default CompletionStep;
