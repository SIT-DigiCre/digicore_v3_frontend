import { convertToHtml } from "../../utils/markdown";

type MarkdownViewProps = {
  md: string;
};

const MarkdownView = ({ md }: MarkdownViewProps) => {
  return (
    <div className="markdown-area" dangerouslySetInnerHTML={{ __html: convertToHtml(md) }}></div>
  );
};

export default MarkdownView;
