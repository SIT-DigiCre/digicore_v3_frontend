import React from "react";

import { Box, Card, Stack } from "@mui/material";

import Heading from "@/components/Common/Heading";

type HomeLinkCardProps = {
  title: string;
  children: React.ReactNode;
  action: React.ReactNode;
};

const HomeLinkCard = ({ title, children, action }: HomeLinkCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        width: "100%",
      }}
    >
      <Heading level={3}>{title}</Heading>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <Stack sx={{ alignItems: "flex-end", mt: 2 }}>{action}</Stack>
    </Card>
  );
};

export default HomeLinkCard;
