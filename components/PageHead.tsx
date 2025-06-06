import { useEffect } from "react";

import { usePageTitle } from "../hook/usePageTitle";

interface PageHeadProps {
  title: string;
}

export default function PageHead({ title }: PageHeadProps) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);
    return () => setTitle("ページタイトル");
  }, [title, setTitle]);

  return null;
}
