import Head from "next/head";
import { useEffect } from "react";

interface PageHeadProps {
  title: string;
  description?: string;
  imgUrl?: string;
}

export default function PageHead({ title, description, imgUrl }: PageHeadProps) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "デジクリ";
    };
  }, [title]);

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
