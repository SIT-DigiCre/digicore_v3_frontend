import Link from "next/link";

import { Alert, Box } from "@mui/material";

type Props = {
  to: string;
  text: string;
};

const FloatingWindow = ({ to, text }: Props) => {
  return (
    <Box
      style={{
        position: "fixed",
        left: 10,
        top: 10,
      }}
    >
      <Alert severity="info">
        <Link href={to}>{text}</Link>
      </Alert>
    </Box>
  );
};

export default FloatingWindow;
