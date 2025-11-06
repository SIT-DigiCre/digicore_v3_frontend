import React from "react";

import { Typography } from "@mui/material";

export type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
};

const Heading: React.FC<HeadingProps> = ({ level, children }) => {
  switch (level) {
    case 1:
      return (
        <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: "bold" }}>
          {children}
        </Typography>
      );
    case 2:
      return (
        <Typography variant="h2" sx={{ fontSize: "2rem", fontWeight: "bold", mb: 2 }}>
          {children}
        </Typography>
      );
    case 3:
      return (
        <Typography variant="h3" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {children}
        </Typography>
      );
    default:
      return (
        <Typography variant="h4" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          {children}
        </Typography>
      );
  }
};

export default Heading;
