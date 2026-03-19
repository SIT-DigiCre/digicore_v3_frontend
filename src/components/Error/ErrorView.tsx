import { Alert, AlertTitle } from "@mui/material";

import { useErrorState } from "../contexts/ErrorStateContext";

const ErrorView = () => {
  const { errors } = useErrorState();

  return (
    <>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>エラー</AlertTitle>
          <ul>
            {errors.map((e) => (
              <li key={e.name}>{e.message}</li>
            ))}
          </ul>
        </Alert>
      )}
    </>
  );
};

export default ErrorView;
