import { useEffect, useRef } from "react";

const ElementResizeListener = (props: { onResize: (event: Event) => void }) => {
  const rafRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onResizeRef = useRef(props.onResize);

  onResizeRef.current = props.onResize;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const notify = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        onResizeRef.current(new Event("resize"));
      });
    };

    const observer = new ResizeObserver(notify);
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
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
