import { Container, DEFAULT_THEME, Group, Title, useMantineColorScheme } from "@mantine/core";
import { NavLink } from "react-router";

export default function DesktopHeader(props: { height?: string }) {

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

  return (
    <header
      style={{
        borderBottom: `1px solid ${DEFAULT_THEME.black}`,
        height: props.height,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1,
        backgroundColor
      }}>
      <Container
        fluid
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <Group justify="space-between" align="center" style={{ width: "100%" }}>
          <Title order={3}>
            <NavLink style={{ textDecoration: "none" }} to="/home">Table Tamer</NavLink>
          </Title>
        </Group>
      </Container>
    </header>
  )
}
