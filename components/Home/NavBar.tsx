import { AppBar, Avatar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Apps, AccountCircle } from "@mui/icons-material";
import { useAuthState } from "../../hook/useAuthState";
import { baseURL } from "../../utils/common";

const NavBar = () => {
  const { authState, onLogin } = useAuthState();
  return (
    <>
      <AppBar position="static" color="primary">
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
          {authState.isLogined ? (
            <>
              <IconButton>
                <Avatar src={authState.user.iconUrl} />
              </IconButton>
            </>
          ) : (
            <Button
              startIcon={<AccountCircle />}
              color="inherit"
              href={baseURL + "/google/oauth/url"}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
