import Link from "next/link";

import { Button } from "@mui/material";

type Props = {
  href: string;
  variant?: "contained" | "outlined" | "text";
  children: React.ReactNode;
  startIcon?: React.ReactNode;
};

export const ButtonLink = ({ href, variant = "contained", children, startIcon }: Props) => {
  return (
    <Button variant={variant} href={href} component={Link} startIcon={startIcon}>
      {children}
    </Button>
  );
};
