import { Alert, AlertTitle } from "@mui/material";

import { useErrorState } from "../../hook/useErrorState";

const ErrorView = () => {
  const { errors } = useErrorState();
  return (
    <>
      {errors.length > 0 ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <ul>
            {errors.map((e) => (
              <li>{e.message}</li>
            ))}
          </ul>
        </Alert>
      ) : (
        <></>
      )}
    </>
  );
};

export default ErrorView;
