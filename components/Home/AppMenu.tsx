import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { Apps, Login } from "@mui/icons-material";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoginIcon from "@mui/icons-material/Login";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import { Tooltip, IconButton, Modal, Box, Button } from "@mui/material";

import { useAuthState } from "../../hook/useAuthState";

import AppMenuButton from "./AppMenuButton";

const appMenuStyle = {
  position: "absolute" as const,
  top: "70px",
  left: "10px",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AppMenu() {
  const [showModal, setShowModal] = useState(false);
  const { authState } = useAuthState();
  const router = useRouter();
  const onClickMenuApp = (to: string) => {
    setShowModal(false);
    router.push(to);
  };
  return (
    <>
      <Tooltip title="デジクリ Apps">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="app-menu"
          sx={{ mr: 2 }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          <Apps />
        </IconButton>
      </Tooltip>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Box sx={appMenuStyle}>
          {authState.isLogined ? (
            <>
              <AppMenuButton
                icon={<HomeIcon />}
                name="Home"
                onClick={() => {
                  onClickMenuApp("/");
                }}
              />
              <AppMenuButton
                icon={<ManageAccountsIcon />}
                name="Profile"
                onClick={() => {
                  onClickMenuApp("/user/profile");
                }}
              />
              <AppMenuButton
                icon={<EventIcon />}
                name="Event"
                onClick={() => {
                  onClickMenuApp("/event");
                }}
              />
              <AppMenuButton
                icon={<SettingsIcon />}
                name="Setting"
                onClick={() => {
                  onClickMenuApp("/setting");
                }}
              />
              <AppMenuButton
                icon={<PeopleAltIcon />}
                name="Users"
                onClick={() => {
                  onClickMenuApp("/user");
                }}
              />
              <AppMenuButton
                icon={<InventoryIcon />}
                name="Works"
                onClick={() => {
                  onClickMenuApp("/work");
                }}
              />
              <AppMenuButton
                icon={<CurrencyYenIcon />}
                name="Payments"
                onClick={() => {
                  onClickMenuApp("/user/form/payment");
                }}
              />
              <AppMenuButton
                icon={<ReceiptLongIcon />}
                name="Budgets"
                onClick={() => {
                  onClickMenuApp("/budget");
                }}
              />
            </>
          ) : (
            <>
              <AppMenuButton
                icon={<LoginIcon />}
                name="Login"
                onClick={() => {
                  onClickMenuApp("/login");
                }}
              />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
