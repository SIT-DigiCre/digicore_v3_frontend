import { useEffect } from "react";

import Head from "next/head";

import { usePageTitle } from "../contexts/PageTitleContext";

interface PageHeadProps {
  title: string;
  description?: string;
  imgUrl?: string;
  url?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
}

export default function PageHead({
  title,
  description,
  imgUrl,
  url,
  ogType = "website",
  twitterCard = "summary",
}: PageHeadProps) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);
    return () => setTitle("デジクリ");
  }, [title]);

  const ogpImageUrl = imgUrl || "https://core3.digicre.net/ogp.png";

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogpImageUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="デジコア" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogpImageUrl} />
      <meta name="twitter:card" content={twitterCard} />
    </Head>
  );
}
