import { useRouter } from "next/router";

import { Apps, AccountCircle } from "@mui/icons-material";
import { AppBar, Avatar, Button, IconButton, Toolbar, Typography } from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { baseURL } from "../../utils/common";

import AccountMenu from "./AccountMenu";
import AppMenu from "./AppMenu";


const NavBar = () => {
  const { authState, onLogin } = useAuthState();
  const router = useRouter();
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <AppMenu />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            デジコア v3.1
          </Typography>
          {authState.isLogined ? (
            <>
              <IconButton>
                <AccountMenu />
              </IconButton>
            </>
          ) : (
            <Button
              startIcon={<AccountCircle />}
              color="inherit"
              onClick={() => {
                localStorage.setItem("backto", router.asPath);
                router.push("/login");
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
