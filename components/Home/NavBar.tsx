import { AppBar, Avatar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Apps, AccountCircle } from "@mui/icons-material";
import { useAuthState } from "../../hook/useAuthState";
import { baseURL } from "../../utils/common";
import AccountMenu from "./AccountMenu";
import AppMenu from "./AppMenu";

const NavBar = () => {
  const { authState, onLogin } = useAuthState();
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <AppMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            デジコア v3.0
          </Typography>
          {authState.isLogined ? (
            <>
              <IconButton>
                <AccountMenu />
              </IconButton>
            </>
          ) : (
            <Button startIcon={<AccountCircle />} color="inherit" href={"/login"}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
