import Link from "next/link";

import { Card, CardActionArea, CardContent, Grid, Box, Typography, SvgIcon } from "@mui/material";

export interface AdminMenuCardProps {
  href: string;
  icon: typeof SvgIcon;
  title: string;
  description: string;
}

const AdminMenuCard = ({ href, icon: Icon, title, description }: AdminMenuCardProps) => (
  <Grid size={{ md: 4, sm: 6, xs: 12 }}>
    <Card
      sx={{
        "&:hover": { boxShadow: 6 },
        height: "100%",
        transition: "box-shadow 0.2s",
      }}
    >
      <CardActionArea component={Link} href={href} sx={{ height: "100%", p: 1 }}>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "primary.main",
              borderRadius: 2,
              color: "primary.contrastText",
              display: "flex",
              height: 56,
              justifyContent: "center",
              mb: 2,
              width: 56,
            }}
          >
            <Icon fontSize="large" />
          </Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default AdminMenuCard;
