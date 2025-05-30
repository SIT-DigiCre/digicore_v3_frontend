import { Alert, AlertTitle } from "@mui/material";

import { useErrorState } from "../../hook/useErrorState";

const ErrorView = () => {
  const { errors } = useErrorState();

  return (
    <>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ m: 2 }}>
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
