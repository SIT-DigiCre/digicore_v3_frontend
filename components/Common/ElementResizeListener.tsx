import { useCallback, useEffect, useRef } from "react";

const ElementResizeListener = (props: { onResize: (event: Event) => void }) => {
  const rafRef = useRef(0);
  const objectRef = useRef<HTMLObjectElement>(null);
  const onResizeRef = useRef(props.onResize);

  onResizeRef.current = props.onResize;

  const _onResize = useCallback((e: Event) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      onResizeRef.current(e);
    });
  }, []);

  const onLoad = useCallback(() => {
    const obj = objectRef.current;
    if (obj && obj.contentDocument && obj.contentDocument.defaultView) {
      // defaultViewはDocumentに関連付けられているWindowオブジェクトを返す
      // object要素のWindowオブジェクトに対し、リサイズイベントを登録する
      obj.contentDocument.defaultView.addEventListener("resize", _onResize);
    }
  }, [_onResize]);

  useEffect(() => {
    // クリーンアップ処理
    return () => {
      const obj = objectRef.current;
      if (obj && obj.contentDocument && obj.contentDocument.defaultView) {
        obj.contentDocument.defaultView.removeEventListener("resize", _onResize);
      }
    };
  }, [_onResize]);

  return (
    <object
      onLoad={onLoad}
      ref={objectRef}
      tabIndex={-1}
      type={"text/html"}
      data={"about:blank"}
      title={""}
      style={{
        height: "100%",
        left: 0,
        opacity: 0,
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default ElementResizeListener;
