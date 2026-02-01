import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { ErrorState } from "../interfaces";

type ErrorStateContextValue = {
  errors: ErrorState[];
  setNewError: (error: ErrorState) => void;
  resetError: () => void;
  removeError: (errorName: string) => void;
};

const ErrorStateContext = createContext<ErrorStateContextValue | null>(null);

export const ErrorStateProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  const setNewError = useCallback((error: ErrorState) => {
    setErrors((prev) => {
      const existing = prev.find((e) => e.name === error.name);
      if (!existing) {
        return [...prev, { ...error, count: 0 }];
      }
      return prev
        .filter((e) => e.name !== error.name)
        .concat({
          name: existing.name,
          count: (existing.count ?? 0) + 1,
          message: error.message,
        });
    });
  }, []);

  const resetError = useCallback(() => setErrors([]), []);

  const removeError = useCallback((errorName: string) => {
    setErrors((prev) => prev.filter((e) => e.name !== errorName));
  }, []);

  const value = useMemo(
    () => ({ errors, setNewError, resetError, removeError }),
    [errors, setNewError, resetError, removeError],
  );

  return <ErrorStateContext.Provider value={value}>{children}</ErrorStateContext.Provider>;
};

export const useErrorStateContext = (): ErrorStateContextValue => {
  const ctx = useContext(ErrorStateContext);
  if (!ctx) throw new Error("useErrorStateContext must be used within ErrorStateProvider");
  return ctx;
};
