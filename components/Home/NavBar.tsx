import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Apps } from "@mui/icons-material";

const NavBar = () => {
  const logined = false;
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="app-menu"
            sx={{ mr: 2 }}
          >
            <Apps />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            デジコア v3.0
          </Typography>
          {logined ? <></> : <Button color="inherit">Login</Button>}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
