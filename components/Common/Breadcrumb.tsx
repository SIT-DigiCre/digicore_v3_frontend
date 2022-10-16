import { Typography } from "@mui/material";
import MBC from "@mui/material/Breadcrumbs";
import Link from "next/link";
type Props = {
  links: { text: string; href?: string }[];
};
const Breadcrumbs = ({ links }: Props) => {
  return (
    <MBC>
      {links.map((link) => {
        if (link.href)
          return (
            <Link href={link.href} key={link.text}>
              <p className="breadcrumbs-link">{link.text}</p>
            </Link>
          );
        else
          return (
            <Typography color="text.primary" key={link.text}>
              {link.text}
            </Typography>
          );
      })}
    </MBC>
  );
};

export default Breadcrumbs;
