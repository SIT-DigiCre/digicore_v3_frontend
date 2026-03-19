import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
});

export const convertToHtml: (md: string) => string = (md) => {
  const config = { ADD_TAGS: ["iframe"], KEEP_CONTENT: false };
  return DOMPurify.sanitize(marked(md) as string, config);
};
