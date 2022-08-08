import { KeyboardReturnOutlined } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { darkModeState } from "../atom/userAtom";
import { DarkMode } from "../interfaces";

type UseDarkMode = () => {
  isDarkMode: boolean;
  setDarkMode: (mode: DarkMode) => void;
};
export const useDarkMode: UseDarkMode = () => {
  const [darkModeValue, setDarkModeValue] = useRecoilState(darkModeState);
  useEffect(() => {
    const localMode = localStorage.getItem("darkmode");
    if (!localMode) return;
    setDarkModeValue(localMode as DarkMode);
  }, []);
  const setDarkMode = (mode: DarkMode) => {
    setDarkMode(mode);
    localStorage.setItem("darkmode", mode);
  };
  return {
    isDarkMode:
      (darkModeValue === "os" ? useMediaQuery("(prefers-color-scheme: dark)") : darkModeValue) ===
      "dark",
    setDarkMode: setDarkMode,
  };
};
