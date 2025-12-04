import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoginIcon from "@mui/icons-material/Login";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";

type MenuItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

type DrawerProps = {
  handleDrawerClose: () => void;
};

const Drawer = ({ handleDrawerClose }: DrawerProps) => {
  const { authState } = useAuthState();
  const router = useRouter();

  const isMenuItemActive = (href: string): boolean => {
    if (href === "/") {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const menuItems: MenuItem[] = [
    {
      href: "/",
      icon: <HomeIcon />,
      label: "ホーム",
    },
    {
      href: "/user/profile",
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

  const adminItem: MenuItem = {
    href: "/admin",
    icon: <AdminPanelSettingsIcon />,
    label: "管理者",
  };

  if (authState.user?.isAdmin) {
    menuItems.push(adminItem);
  }
  return (
    <Box role="navigation" aria-label="メインメニュー">
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
    </Box>
  );
};

export default Drawer;
