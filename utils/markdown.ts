import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

marked.setOptions({
  // highlightは主に使用しているわけではないので、エラーを回避するため一旦コメントアウト
  // highlight: (code, lang) => {
  //   return highlight.highlightAuto(code, [lang]).value;
  // },
  // langPrefix: "hljs language-",
  breaks: true,
});

export const convertToHtml: (md: string) => string = (md) => {
  const config = { ADD_TAGS: ["iframe"], KEEP_CONTENT: false };
  return DOMPurify.sanitize(marked(md) as string, config);
};
