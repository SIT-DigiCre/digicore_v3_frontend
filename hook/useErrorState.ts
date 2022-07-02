import { useRecoilState } from "recoil";
import { errorState } from "../atom/userAtom";
import { ErrorState } from "../interfaces";
type UseErrorState = () => {
  errors: ErrorState[];
  setNewError: (error: ErrorState) => void;
  resetError: () => void;
};

export const useErrorState: UseErrorState = () => {
  const [errors, setErrors] = useRecoilState(errorState);

  const setNewError = (error: ErrorState) => {
    if (errors.find((e) => e.name === error.name) === undefined) {
      //新規エラー
      setErrors([...errors, error]);
    } else {
      //既存エラー
      errors.find((e) => e.name === error.name).count++;
      setErrors(errors);
    }
  };

  const resetError = () => {
    setErrors([]);
  };

  return {
    errors: errors,
    setNewError: setNewError,
    resetError: resetError,
  };
};
