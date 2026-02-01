import { useCallback, useEffect, useRef } from "react";

const ElementResizeListener = (props: { onResize: (event: Event) => void }) => {
  const rafRef = useRef(0);
  const objectRef = useRef<HTMLObjectElement>(null);
  const windowRef = useRef<Window | null>(null);
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
    if (obj?.contentDocument?.defaultView) {
      const win = obj.contentDocument.defaultView;
      windowRef.current = win;
      win.addEventListener("resize", _onResize);
    }
  }, [_onResize]);

  useEffect(() => {
    return () => {
      const win = windowRef.current;
      if (win) {
        win.removeEventListener("resize", _onResize);
        windowRef.current = null;
      }
    };
  }, [_onResize]);

  return (
    <object
      aria-label="リサイズ検知用（非表示）"
      data={"about:blank"}
      onLoad={onLoad}
      ref={objectRef}
      tabIndex={-1}
      title={""}
      type={"text/html"}
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
