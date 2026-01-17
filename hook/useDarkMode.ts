import { useEffect } from "react";

import { useMediaQuery } from "@mui/material";
import { useRecoilState } from "recoil";

import { darkModeState } from "../atom/userAtom";

import type { DarkMode } from "../interfaces";

type UseDarkMode = () => {
  isDarkMode: boolean;
  setDarkMode: (mode: DarkMode) => void;
  currentMode: DarkMode;
};
export const useDarkMode: UseDarkMode = () => {
  const [darkModeValue, setDarkModeValue] = useRecoilState(darkModeState);
  useEffect(() => {
    try {
      const localMode = localStorage.getItem("darkmode");
      if (localMode === null || localMode === "") return;
      setDarkModeValue(localMode as DarkMode);
    } catch (err) {
      console.error(err);
    }
  }, []);
  const setDarkMode = (mode: DarkMode) => {
    if (mode === darkModeValue) return;
    setDarkModeValue(mode);
    localStorage.setItem("darkmode", mode);
  };
  const osSetting = useMediaQuery("(prefers-color-scheme: dark)");
  return {
    isDarkMode: darkModeValue === "os" ? osSetting : darkModeValue === "dark",
    setDarkMode: setDarkMode,
    currentMode: darkModeValue,
  };
};
