import { ActionIcon, Container, DEFAULT_THEME, Group, MantineStyleProp, Text, useMantineColorScheme } from "@mantine/core";
import { IconBrandGitlab } from "@tabler/icons-react";
import { CSSProperties } from "react";
import i18n from "../../i18n";

export default function DesktopFooter(props: { height?: string, style?: CSSProperties | undefined }) {
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

  const style: MantineStyleProp = {
    ...props.style,
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: props.height,
    borderTop: `1px solid ${DEFAULT_THEME.black}`,
    background: backgroundColor,
    zIndex: 1
  };

  return (
    <footer style={style}>
      <Container
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Group justify="space-between" style={{ width: "100%" }}>
          <Text size="xs">{i18n.t("login.copyright")}</Text>
          <Group>
            <ActionIcon variant="light" component="a" target="_blank" href="https://gitlab.com/jccc7913624/cis-264/sp-2025/team-4/table-tamer">
              <IconBrandGitlab />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </footer>
  )
}