import { useState } from "react";

import MarkdownEditor from "../../components/Common/MarkdownEditor";

const MarkdownEditorPage = () => {
  const [md, setMd] = useState("");
  return (
    <div style={{ margin: "3px" }}>
      <MarkdownEditor
        value={md}
        onChange={(value) => {
          setMd(value);
        }}
      />
    </div>
  );
};

export default MarkdownEditorPage;
