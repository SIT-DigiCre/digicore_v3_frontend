import { Alert, Box } from "@mui/material";
import Link from "next/link";

type Props = {
  to: string;
  text: string;
};
const style = {};

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
