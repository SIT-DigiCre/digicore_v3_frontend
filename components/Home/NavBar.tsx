import { useRouter } from "next/router";

import { AccountCircle } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";

import AccountMenu from "./AccountMenu";
import AppMenu from "./AppMenu";

const NavBar = () => {
  const { authState } = useAuthState();
  const router = useRouter();

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <AppMenu />
          <Box sx={{ flexGrow: 1 }}>デジコア v3.1</Box>
          {authState.isLogined ? (
            <IconButton>
              <AccountMenu />
            </IconButton>
          ) : router.pathname !== "/login" ? (
            <Button
              startIcon={<AccountCircle />}
              color="inherit"
              onClick={() => {
                localStorage.setItem("backto", router.asPath);
                router.push("/login");
              }}
            >
              ログインする
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
