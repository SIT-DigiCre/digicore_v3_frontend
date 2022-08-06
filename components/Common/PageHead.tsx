import Head from "next/head";
type Props = {
  title: string;
  description?: string;
  imgUrl?: string;
};
const PageHead = ({ title, description, imgUrl }: Props) => {
  return (
    <Head>
      <title>{title + " - デジコア3"}</title>
      <meta property="og:title" content={title + " - デジコア3"} />
      <meta
        property="og:description"
        content={description ? description : "芝浦工業大学デジクリのグループウェア"}
      />
      {imgUrl ? <meta property="og:image" content={imgUrl} /> : <></>}
    </Head>
  );
};
export default PageHead;
