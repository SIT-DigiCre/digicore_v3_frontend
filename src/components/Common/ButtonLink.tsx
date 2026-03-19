import { Button } from "@mui/material";
import Link from "next/link";

type Props = {
  href: string;
  target?: "_blank" | "_self";
  rel?: "noopener noreferrer";
  variant?: "contained" | "outlined" | "text";
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
};

export const ButtonLink = ({
  children,
  variant = "contained",
  disabled = false,
  ...props
}: Props) => {
  return (
    <Button component={Link} variant={variant} disabled={disabled} {...props}>
      {children}
    </Button>
  );
};
