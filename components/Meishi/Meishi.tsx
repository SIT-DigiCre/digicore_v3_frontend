//import { useRef, useEffect } from "react";

import { markupToFullHtml } from "../../utils/meishi/convert";

type Props = {
  markup: string;

  width?: number;
  height?: number;
};

const Meishi = ({ markup, width, height }: Props) => {
  const w = width ? width : 1253;
  const h = height ? width : 756;

  let wrapper = document.createElement("div");
  wrapper.className = "meishi";
  wrapper.style.width = `${w}px`;
  wrapper.style.height = `${h}px`;
  wrapper.innerHTML = markup;
  const srcHtml = markupToFullHtml(wrapper.outerHTML);

  return <iframe srcDoc={srcHtml} style={{ width: w, height: h, border: 0 }} />;
  /*
  return (
    <div
      className="meishi"
      style={{ width: w, height: h }}
      dangerouslySetInnerHTML={{
        __html: rawHtml,
      }}
    ></div>
  );
  */
};

export default Meishi;
