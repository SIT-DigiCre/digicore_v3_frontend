//import { useRef, useEffect } from "react";

import { textToHtml } from "../../utils/meishi/convert";

type Props = {
  markup: string;

  width?: number;
  height?: number;
};

const Meishi = ({ markup, width, height }: Props) => {
  const w = width ? width : 1253;
  const h = height ? width : 756;

  const rawHtml = textToHtml(markup);

  return (
    <div
      className="meishi"
      style={{ width: w, height: h }}
      dangerouslySetInnerHTML={{
        __html: rawHtml,
      }}
    ></div>
  );
};

export default Meishi;
