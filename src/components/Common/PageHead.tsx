import { useEffect } from "react";

import Head from "next/head";

import { usePageTitle } from "../contexts/PageTitleContext";

type OpenGraphMetadata = {
  title?: string;
  description?: string;
  url: string;
  image: string;
  type: "website" | "article";
  siteName?: string;
};

type TwitterMetadata = {
  title?: string;
  description?: string;
  image?: string;
  card?: "summary" | "summary_large_image";
};

type PageHeadMetadata = {
  title: string;
  description?: string;
  openGraph: OpenGraphMetadata;
  twitter?: TwitterMetadata;
};

type PageHeadProps =
  | {
      title: string;
      description?: string;
      metadata?: undefined;
    }
  | {
      metadata: PageHeadMetadata;
      title?: never;
      description?: never;
    };

const createDefaultMetadata = (title: string, description?: string): PageHeadMetadata => ({
  description,
  openGraph: {
    description,
    image: "https://core3.digicre.net/ogp.png",
    siteName: "デジコア",
    title,
    type: "website",
    url: "https://core3.digicre.net",
  },
  title,
  twitter: {
    card: "summary",
    description,
    image: "https://core3.digicre.net/ogp.png",
    title,
  },
});

export default function PageHead(props: PageHeadProps) {
  const { setTitle } = usePageTitle();

  const metadata =
    props.metadata === undefined
      ? createDefaultMetadata(props.title, props.description)
      : props.metadata;

  useEffect(() => {
    setTitle(metadata.title);
    return () => setTitle("デジクリ");
  }, [metadata.title]);

  const ogTitle = metadata.openGraph.title ?? metadata.title;
  const ogDescription = metadata.openGraph.description ?? metadata.description;
  const ogImage = metadata.openGraph.image;
  const ogSiteName = metadata.openGraph.siteName ?? "デジコア";

  const twitterTitle = metadata.twitter?.title ?? ogTitle;
  const twitterDescription = metadata.twitter?.description ?? ogDescription;
  const twitterImage = metadata.twitter?.image ?? ogImage;
  const twitterCard = metadata.twitter?.card ?? "summary";

  return (
    <Head>
      <title>{metadata.title}</title>
      {metadata.description && <meta name="description" content={metadata.description} />}

      <meta property="og:title" content={ogTitle} />
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={metadata.openGraph.type} />
      <meta property="og:site_name" content={ogSiteName} />

      <meta name="twitter:title" content={twitterTitle} />
      {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:card" content={twitterCard} />
    </Head>
  );
}
