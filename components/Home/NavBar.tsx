import { AppBar, Avatar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Apps, AccountCircle } from "@mui/icons-material";
import { useAuthState } from "../../hook/useAuthState";

const NavBar = () => {
  const { isLogined, isLoading, user, token, onLogin } = useAuthState();
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
          {isLogined ? (
            <>
              <IconButton>
                <Avatar src={user.iconUrl} />
              </IconButton>
            </>
          ) : (
            <Button
              startIcon={<AccountCircle />}
              color="inherit"
              onClick={() => {
                onLogin("hoge"); //検証用　後で消す
              }}
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
