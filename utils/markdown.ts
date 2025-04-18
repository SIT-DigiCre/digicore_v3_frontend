import { marked } from "marked";
import highlight from "highlightjs";
import DOMPurify from "isomorphic-dompurify";

marked.setOptions({
  // highlightは主に使用しているわけではないので、エラーを回避するため一旦コメントアウト
  // highlight: (code, lang) => {
  //   return highlight.highlightAuto(code, [lang]).value;
  // },
  // langPrefix: "hljs language-",
  breaks: true,
});

export const convertToPlainText: (md: string) => string = (md) => {
  const str = convertToHtmlWithoutIframe(md);
  return str.replace(/(<([^>]+)>)/gi, " "); //HTMLタグを削除して中身のみを取り出す
};

export const getPreviewText: (md: string, limit: number) => string = (md, limit) => {
  const str = convertToPlainText(md);
  if (str.length > limit) return str.substring(0, limit);
  return str;
};

export const convertToHtmlWithoutIframe: (md: string) => string = (md) => {
  return DOMPurify.sanitize(marked(md) as string);
};

export const convertToHtml: (md: string) => string = (md) => {
  const config = { ADD_TAGS: ["iframe"], KEEP_CONTENT: false };
  return DOMPurify.sanitize(marked(md) as string, config);
};
