import { Typography } from "@mui/material";
import MBC from "@mui/material/Breadcrumbs";
import Link from "next/link";
type Props = {
  links: { text: string; href?: string }[];
};
const Breadcrumbs = ({ links }: Props) => {
  return (
    <MBC>
      {links.map((link) => (
        <div key={link.text}>
          {link.href ? (
            <Link href={link.href}>
              <p className="breadcrumbs-link">{link.text}</p>
            </Link>
          ) : (
            <Typography color="text.primary">{link.text}</Typography>
          )}
        </div>
      ))}
    </MBC>
  );
};

export default Breadcrumbs;
