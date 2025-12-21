import { useRecoilState } from "recoil";

import { errorState } from "../atom/userAtom";
import { ErrorState } from "../interfaces";
type UseErrorState = () => {
  errors: ErrorState[];
  setNewError: (error: ErrorState) => void;
  resetError: () => void;
  removeError: (errorName: string) => void;
};

export const useErrorState: UseErrorState = () => {
  const [errors, setErrors] = useRecoilState(errorState);

  const setNewError = (error: ErrorState) => {
    if (errors.find((e) => e.name === error.name) === undefined) {
      //新規エラー
      error.count = 0;
      setErrors([...errors, error]);
    } else {
      //既存エラー
      const targetError = errors.find((e) => e.name === error.name);
      const editError = errors.filter((e) => e.name !== error.name);
      if (!targetError) return;
      setErrors([
        ...editError,
        {
          name: targetError.name,
          count: (targetError.count ?? 0) + 1,
          message: targetError.message,
        },
      ]);
    }
  };

  const resetError = () => {
    setErrors([]);
  };

  const removeError = (errorName: string) => {
    setErrors(errors.filter((e) => e.name !== errorName));
  };

  return {
    errors: errors,
    setNewError: setNewError,
    resetError: resetError,
    removeError: removeError,
  };
};
