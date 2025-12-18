import Link from "next/link";

import { Button } from "@mui/material";

type Props = {
  href: string;
  target?: "_blank" | "_self";
  rel?: "noopener noreferrer";
  variant?: "contained" | "outlined" | "text";
  children: React.ReactNode;
  startIcon?: React.ReactNode;
};

export const ButtonLink = ({ children, variant = "contained", ...props }: Props) => {
  return (
    <Button component={Link} variant={variant} {...props}>
      {children}
    </Button>
  );
};
