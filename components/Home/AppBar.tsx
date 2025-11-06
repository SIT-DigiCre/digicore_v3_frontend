import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoginIcon from "@mui/icons-material/Login";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Toolbar,
} from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";
import { usePageTitle } from "../../hook/usePageTitle";
import Heading from "../Common/Heading";

const drawerWidth = 240;

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface AppBarProps {
  children?: React.ReactNode;
  window?: () => Window;
}

export default function AppBar({ children, window }: AppBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { authState } = useAuthState();
  const router = useRouter();
  const { title } = usePageTitle();

  const isMenuItemActive = (href: string): boolean => {
    if (href === "/") {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const menuItems: MenuItem[] = [
    {
      href: "/",
      icon: <HomeIcon />,
      label: "ホーム",
    },
    {
      href: "/user/profile/public",
      icon: <ManageAccountsIcon />,
      label: "プロフィール",
    },
    {
      href: "/event",
      icon: <EventIcon />,
      label: "イベント",
    },
    {
      href: "/member",
      icon: <PeopleAltIcon />,
      label: "部員一覧",
    },
    {
      href: "/work",
      icon: <InventoryIcon />,
      label: "作品",
    },
    {
      href: "/user/form/payment",
      icon: <CurrencyYenIcon />,
      label: "部費振込",
    },
    {
      href: "/budget",
      icon: <ReceiptLongIcon />,
      label: "稟議",
    },
    {
      href: "/setting",
      icon: <SettingsIcon />,
      label: "設定",
    },
  ];

  const loginItem: MenuItem = {
    href: "/login",
    icon: <LoginIcon />,
    label: "ログイン",
  };

  const drawer = (
    <div role="navigation" aria-label="メインメニュー">
      <Toolbar sx={{ justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/image/digicre-logo.webp"
            alt="デジクリ Digital Creation Circle"
            width={180}
            height={60}
          />
        </Link>
      </Toolbar>
      <Divider />
      <List role="menu" aria-label="メニュー項目">
        {authState.isLogined ? (
          menuItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link
                href={item.href}
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
              >
                <ListItemButton
                  role="menuitem"
                  tabIndex={0}
                  onClick={handleDrawerClose}
                  sx={{
                    backgroundColor: isMenuItemActive(item.href)
                      ? "action.selected"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isMenuItemActive(item.href)
                        ? "action.selected"
                        : "action.hover",
                    },
                  }}
                >
                  <ListItemIcon aria-hidden="true">{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        ) : (
          <ListItem disablePadding>
            <Link
              href={loginItem.href}
              style={{ textDecoration: "none", color: "inherit", width: "100%" }}
            >
              <ListItemButton
                role="menuitem"
                tabIndex={0}
                onClick={handleDrawerClose}
                sx={{
                  backgroundColor: isMenuItemActive(loginItem.href)
                    ? "action.selected"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isMenuItemActive(loginItem.href)
                      ? "action.selected"
                      : "action.hover",
                  },
                }}
              >
                <ListItemIcon aria-hidden="true">{loginItem.icon}</ListItemIcon>
                <ListItemText primary={loginItem.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
            aria-label="メニューを開く"
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
        <Drawer
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
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, py: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
