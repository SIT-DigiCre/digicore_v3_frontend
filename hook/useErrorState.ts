import { useRecoilState } from "recoil";
import { errorState } from "../atom/userAtom";
import { ErrorState } from "../interfaces";
type UseErrorState = () => {
  errors: ErrorState[];
  setNewError: (error: ErrorState) => void;
};

export const useErrorState: UseErrorState = () => {
  const [errors, setErrors] = useRecoilState(errorState);

  const setNewError = (error: ErrorState) => {
    setErrors([...errors, error]);
  };

  return {
    errors: errors,
    setNewError: setNewError,
  };
};
