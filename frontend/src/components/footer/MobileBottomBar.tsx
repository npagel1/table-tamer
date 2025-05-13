import {  DEFAULT_THEME, Group, useMantineColorScheme } from "@mantine/core";

import CustomerBottomBarContent from "./CustomerBottomBarContent";
import StaffBottomBarContent from "./StaffBottomBarContent";
import { CustomerType, StaffType } from "../../PageLayout";

// Mobile bottom bar container: conditionally diplays customers or staff content
export default function MobileBottomBar({ activeUser }: { activeUser: CustomerType | StaffType }) {
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

  const footerStyle: {} = {
    position: "fixed",
    bottom: 0,
    right: 0,
    left: 0,
    borderTop: "1px solid #ddd",
    background: backgroundColor,
    // background: "#228be6",
    zIndex: 9
  };

  const isStaff = activeUser.hasOwnProperty("staff_role");
  
  return (
    <Group p="md" justify="space-between" component="footer" style={footerStyle}>
      {isStaff && <StaffBottomBarContent />}
      {!isStaff && <CustomerBottomBarContent />}
    </Group>
  )
}