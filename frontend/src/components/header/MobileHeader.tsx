import { Box, Center, DEFAULT_THEME, Text, Title, useMantineColorScheme } from "@mantine/core";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

// Mobile header - dynamically displays page location
export default function MobileHeader() {
  const { i18n } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const isBrowserColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let backgroundColor = DEFAULT_THEME.colors.dark[7];

  if (colorScheme === "light") {
    backgroundColor = DEFAULT_THEME.white;
  } else if (colorScheme === "auto") {
    if (!isBrowserColorSchemeDark) {
      backgroundColor = DEFAULT_THEME.white;
    }
  }

  let location = useLocation();
  let pathname = location.pathname.slice(1);
  pathname = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  let displayPath = location.pathname;

  if (location.pathname === "/") displayPath = "Table Tamer";
  if (location.pathname === "/reservations") displayPath = i18n.t("menu.reservations");
  if (location.pathname === "/loyalty") displayPath = i18n.t("menu.loyalty");
  if (location.pathname === "/account") displayPath = i18n.t("menu.account");
  if (location.pathname === "/admin/reservations") displayPath = i18n.t("Admin");

  return (
    <Box
      component="header"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        borderBottom: "1px solid",
        zIndex: 10,
        // background: backgroundColor,
        background: "#228be6",
        color: DEFAULT_THEME.white
      }}>
      <Center p="sm">
        <Title size="md">{displayPath}</Title>
      </Center>
    </Box>
  );
}