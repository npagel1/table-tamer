import { ActionIcon, Text } from "@mantine/core";
import { IconHome, IconHomeFilled, IconStar, IconStarFilled, IconUser, IconUserFilled } from "@tabler/icons-react";
import { NavLink, useLocation } from "react-router";

import ReservationLinkIcon from "./ReservationLinkIcon";
import { useTranslation } from "react-i18next";

// Content only for customer mobile bottom bar
export default function CustomerBottomBarContent() {
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
      <NavLink to="/home" style={navLinkStyle}>
        <ActionIcon size="lg" variant="subtle" component="span">
          {(location.pathname === "/home" || location.pathname === "/") ? <IconHomeFilled /> : <IconHome />}
        </ActionIcon>
        <Text size="sm">{i18n.t("menu.home")}</Text>
      </NavLink>
      <NavLink to="/reservations" style={navLinkStyle}>
        <ReservationLinkIcon pathname={location.pathname} />
        <Text size="sm">{i18n.t("menu.reservations")}</Text>
      </NavLink>
      <NavLink
        to="/loyalty"
        className={({ isActive }) => (isActive ? "active" : "")}
        style={navLinkStyle}
      >
        <ActionIcon size="lg" variant="subtle">
          {location.pathname === "/loyalty" ? <IconStarFilled /> : <IconStar />}
        </ActionIcon>
        <Text size="sm">{i18n.t("menu.loyalty")}</Text>
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) => (isActive ? "active" : "")}
        style={navLinkStyle}
      >
        <ActionIcon size="lg" variant="subtle">
          {location.pathname === "/account" ? <IconUserFilled /> : <IconUser />}
        </ActionIcon>
        <Text size="sm">{i18n.t("menu.account")}</Text>
      </NavLink>
    </>
  );
}