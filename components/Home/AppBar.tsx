import Link from "next/link";
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
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { useAuthState } from "../../hook/useAuthState";

const drawerWidth = 240;

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
}

interface PersistentDrawerProps {
  children?: React.ReactNode;
  window?: () => Window;
}

export default function ResponsiveDrawer({ children, window }: PersistentDrawerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { authState } = useAuthState();

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
      ariaLabel: "ホームページへ移動",
    },
    {
      href: "/user/profile",
      icon: <ManageAccountsIcon />,
      label: "プロフィール",
      ariaLabel: "プロフィールページへ移動",
    },
    {
      href: "/event",
      icon: <EventIcon />,
      label: "イベント",
      ariaLabel: "イベントページへ移動",
    },
    {
      href: "/setting",
      icon: <SettingsIcon />,
      label: "設定",
      ariaLabel: "設定ページへ移動",
    },
    {
      href: "/user",
      icon: <PeopleAltIcon />,
      label: "ユーザー",
      ariaLabel: "ユーザーページへ移動",
    },
    {
      href: "/work",
      icon: <InventoryIcon />,
      label: "作品",
      ariaLabel: "作品一覧ページへ移動",
    },
    {
      href: "/user/form/payment",
      icon: <CurrencyYenIcon />,
      label: "部費振込",
      ariaLabel: "部費振込ページへ移動",
    },
    {
      href: "/budget",
      icon: <ReceiptLongIcon />,
      label: "稟議",
      ariaLabel: "稟議ページへ移動",
    },
  ];

  const loginItem: MenuItem = {
    href: "/login",
    icon: <LoginIcon />,
    label: "ログイン",
    ariaLabel: "ログインページへ移動",
  };

  const drawer = (
    <div role="navigation" aria-label="メインメニュー">
      <Toolbar />
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
                  aria-label={item.ariaLabel}
                  tabIndex={0}
                  onClick={handleDrawerClose}
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
                aria-label={loginItem.ariaLabel}
                tabIndex={0}
                onClick={handleDrawerClose}
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
          <Typography variant="h6" noWrap component="div" role="heading" aria-level={1}>
            デジクリ
          </Typography>
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
      <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
