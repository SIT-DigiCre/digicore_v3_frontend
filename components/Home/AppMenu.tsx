import { Tooltip, IconButton } from "@mui/material";
import { Apps } from "@mui/icons-material";

export default function AppMenu() {
  return (
    <Tooltip title="デジクリ Apps">
      <IconButton size="large" edge="start" color="inherit" aria-label="app-menu" sx={{ mr: 2 }}>
        <Apps />
      </IconButton>
    </Tooltip>
  );
}
