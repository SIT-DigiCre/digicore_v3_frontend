import { IconButton } from "@mui/material";
import Link from "next/link";

type Props = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
};

export const IconButtonLink = ({ href, ariaLabel, children }: Props) => (
  <IconButton aria-label={ariaLabel} href={href} component={Link}>
    {children}
  </IconButton>
);
