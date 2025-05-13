import { ActionIcon, Text } from "@mantine/core";
import { IconClipboardText, IconClipboardTextFilled, IconUser, IconUserFilled } from "@tabler/icons-react";
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

// Content only for staff mobile bottom bar
export default function StaffBottomBarContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <>
      <NavLink to="admin/reservations" style={navLinkStyle}>
        <ActionIcon size="lg" variant="subtle" component="span">
          {location.pathname === "/admin/reservations"
            ? <IconClipboardTextFilled />
            : <IconClipboardText />}
        </ActionIcon>
        <Text size="sm">{i18n.t("menu.reservations")}</Text>
      </NavLink>
      <NavLink to="/account" style={navLinkStyle}>
        <ActionIcon size="lg" variant="subtle" component="span">
        {location.pathname === "/account" ? <IconUserFilled /> : <IconUser />}
        </ActionIcon>
        <Text size="sm">{i18n.t("menu.account")}</Text>
      </NavLink>
    </>
  );
}