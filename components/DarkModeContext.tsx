import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useMediaQuery } from "@mui/material";

import type { DarkMode } from "../interfaces";

type DarkModeContextValue = {
  isDarkMode: boolean;
  setDarkMode: (mode: DarkMode) => void;
  currentMode: DarkMode;
};

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkModeValue, setDarkModeValue] = useState<DarkMode>("os");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const local = localStorage.getItem("darkmode");
    if (local === "dark" || local === "light" || local === "os") setDarkModeValue(local);
  }, []);

  const osSetting = useMediaQuery("(prefers-color-scheme: dark)");
  const isDarkMode = darkModeValue === "os" ? osSetting : darkModeValue === "dark";

  const setDarkMode = useCallback((mode: DarkMode) => {
    setDarkModeValue((prev) => {
      if (prev === mode) return prev;
      localStorage.setItem("darkmode", mode);
      return mode;
    });
  }, []);

  const value = useMemo(
    () => ({
      currentMode: darkModeValue,
      isDarkMode,
      setDarkMode,
    }),
    [isDarkMode, setDarkMode, darkModeValue],
  );

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
};

export const useDarkModeContext = (): DarkModeContextValue => {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkModeContext must be used within DarkModeProvider");
  return ctx;
};
