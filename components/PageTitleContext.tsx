import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type PageTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export const PageTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitleState] = useState("デジクリ");

  const setTitle = useCallback((t: string) => {
    setTitleState(t);
  }, []);

  const value = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>;
};

export const usePageTitle = (): PageTitleContextValue => {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error("usePageTitle must be used within PageTitleProvider");
  return ctx;
};
