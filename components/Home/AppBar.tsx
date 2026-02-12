import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Container,
  IconButton,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Stack,
  Toolbar,
} from "@mui/material";

import Heading from "../Common/Heading";
import { usePageTitle } from "../contexts/PageTitleContext";
import ErrorView from "../Error/ErrorView";
import Drawer from "./Drawer";

const drawerWidth = 240;

interface AppBarProps {
  children?: React.ReactNode;
  window?: () => Window;
}

export default function AppBar({ children, window }: AppBarProps) {
  const { title } = usePageTitle();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  return (
    <Stack>
      <MuiAppBar
        component="header"
        position="fixed"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={mobileOpen}
            aria-controls="navigation-menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Heading level={1}>{title}</Heading>
        </Toolbar>
      </MuiAppBar>
      <Box
        component="nav"
        id="navigation-menu"
        sx={{ flexShrink: { sm: 0 }, width: { sm: drawerWidth } }}
        aria-label="メインナビゲーション"
      >
        <MuiDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            display: { sm: "none", xs: "block" },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          <Drawer handleDrawerClose={handleDrawerClose} />
        </MuiDrawer>
        <MuiDrawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            display: { sm: "block", xs: "none" },
          }}
          open
        >
          <Drawer handleDrawerClose={handleDrawerClose} />
        </MuiDrawer>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` },
          py: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container component="main" sx={{ minHeight: "65vh", p: 0, px: 2 }}>
          <ErrorView />
          {children}
        </Container>
      </Box>
    </Stack>
  );
}
