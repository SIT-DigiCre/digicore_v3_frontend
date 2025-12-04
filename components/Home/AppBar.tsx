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
  Typography,
} from "@mui/material";

import { usePageTitle } from "../../hook/usePageTitle";
import Heading from "../Common/Heading";
import ErrorView from "../Error/ErrorView";

import Drawer from "./Drawer";

const drawerWidth = 240;

interface AppBarProps {
  children?: React.ReactNode;
  window?: () => Window;
}

export default function AppBar({ children, window }: AppBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { title } = usePageTitle();

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
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        role="banner"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={mobileOpen}
            aria-controls="navigation-menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Heading level={1}>{title}</Heading>
        </Toolbar>
      </MuiAppBar>
      <Box
        component="nav"
        id="navigation-menu"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="メインナビゲーション"
      >
        <MuiDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
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
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          <Drawer handleDrawerClose={handleDrawerClose} />
        </MuiDrawer>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          py: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Container component="main" sx={{ minHeight: "65vh", p: 0, px: 2 }}>
          <ErrorView />
          {children}
        </Container>
        <footer style={{ textAlign: "center", padding: "2rem 0" }}>
          <Typography>
            <a href="https://intercom.help/icons8-7fb7577e8170/en/articles/5534926-universal-multimedia-licensing-agreement-for-icons8">
              Icons8 License
            </a>
          </Typography>
          <Typography>&copy; 2022-2025</Typography>
          <Typography>芝浦工業大学 デジクリ</Typography>
        </footer>
      </Box>
    </Stack>
  );
}
