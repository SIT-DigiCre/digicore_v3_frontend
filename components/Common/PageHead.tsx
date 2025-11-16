import Head from "next/head";
import { useEffect } from "react";

import { usePageTitle } from "../../hook/usePageTitle";

interface PageHeadProps {
  title: string;
  description?: string;
  imgUrl?: string;
}

export default function PageHead({ title, description, imgUrl }: PageHeadProps) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);
    return () => setTitle("デジクリ");
  }, [title, setTitle]);

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {imgUrl ? (
        <meta property="og:image" content={imgUrl} />
      ) : (
        <meta property="og:image" content="https://core3.digicre.net/image/digicore.png" />
      )}
      <meta property="og:site_name" content="デジコア" />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
}
