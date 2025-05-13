import { useContext } from "react";
import { useNavigate } from "react-router";
import { DEFAULT_THEME, MantineStyleProp, NavLink as MantineNavLink, Stack, Badge, em, Indicator, useMantineColorScheme } from "@mantine/core";
import { IconBowlSpoon, IconClipboardText, IconHome, IconStar, IconUser } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

import { AppContext } from "../PageLayout";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  footerHeight?: string;
  headerHeight?: string;
  width?: string;
}

export default function Navbar(props: NavbarProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isTablet = useMediaQuery(`(min-width: ${em(750)}) and (max-width: ${em(1023)})`);
  const isDesktop = useMediaQuery(`(min-width: ${em(1024)})`);
  const { activeUser, reservationCount } = useContext(AppContext);
  const isStaff = activeUser?.hasOwnProperty("staff_role");
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

  const navbarStyle: MantineStyleProp = {
    width: props.width || "300px",
    position: "fixed",
    left: 0,
    minHeight: "200px",
    top: props.headerHeight,
    height: `calc(100vh - ${props.headerHeight}`,
    zIndex: 99,
    borderRight: `1px solid ${DEFAULT_THEME.black}`,
    paddingTop: DEFAULT_THEME.spacing.md,
    background: backgroundColor,
  };

  const navLinkStyleTablet = {
    root: {
      flexDirection: "column",
    },
    section: {
        margin: 0,
    },
    label: {
      fontSize: DEFAULT_THEME.fontSizes.xs,
    }
  };

  const navLinkStyleDesktop = {
    label: {
      fontSize: DEFAULT_THEME.fontSizes.lg
    }
  };

  const navLinkStyle = isTablet ? navLinkStyleTablet : isDesktop ? navLinkStyleDesktop : {};

  return (
    <nav style={navbarStyle}>
      <Stack h="100%" p="md" gap="md">
        {!isStaff &&
          <MantineNavLink
            active={location.pathname.includes("home")}
            label={i18n.t("menu.home")}
            leftSection={<IconHome />}
            style={navLinkStyle}
            onClick={() => navigate("/home")}
          />
        }
        {!isStaff &&
          <>
            {isTablet &&
              <Indicator size={16} label={reservationCount}>
                <MantineNavLink
                  active={location.pathname.includes("reservations")}
                  label={i18n.t("menu.reservations")}
                  leftSection={<IconBowlSpoon />}
                  rightSection={
                    isDesktop && (reservationCount && <Badge variant="filled" color="red">{reservationCount}</Badge>)
                  }
                  style={navLinkStyle}
                  onClick={() => navigate("/reservations")}
                />
              </Indicator>
            }
            {!isTablet &&
              <MantineNavLink
                active={location.pathname.includes("reservations")}
                label={i18n.t("menu.reservations")}
                leftSection={<IconBowlSpoon />}
                rightSection={
                  isDesktop && (reservationCount && <Badge variant="filled" color="red">{reservationCount}</Badge>)
                }
                style={navLinkStyle}
                onClick={() => navigate("/reservations")}
              />
            }
          </>
        }
        {!isStaff &&
          <MantineNavLink
            active={location.pathname.includes("loyalty")}
            label={i18n.t("menu.loyalty")}
            leftSection={<IconStar />}
            style={navLinkStyle}
            noWrap={true}
            onClick={() => navigate("/loyalty")}
          />
        }
        {isStaff &&
          <>
            {isTablet &&
              <Indicator size={16} label={reservationCount}>
                <MantineNavLink
                  active={location.pathname.includes("/admin/reservations")}
                  label={i18n.t("menu.reservations")}
                  leftSection={<IconClipboardText />}
                  rightSection={
                    isDesktop && (reservationCount && <Badge variant="filled" color="red">{reservationCount}</Badge>)
                  }
                  style={navLinkStyle}
                  onClick={() => navigate("/admin/reservations")}
                />
              </Indicator>
            }
            {!isTablet &&
              <MantineNavLink
                active={location.pathname.includes("/admin/reservations")}
                label={i18n.t("menu.reservations")}
                leftSection={<IconClipboardText />}
                rightSection={
                  isDesktop && (reservationCount && <Badge variant="filled" color="red">{reservationCount}</Badge>)
                }
                style={navLinkStyle}
                onClick={() => navigate("/admin/reservations")}
              />
            }
          </>
        }
        <MantineNavLink
          mt="auto"
          active={location.pathname.includes("account")}
          label={i18n.t("menu.account")}
          leftSection={<IconUser />}
          style={navLinkStyle}
          onClick={() => navigate("/account")}
        />
      </Stack>
    </nav>
  );
}