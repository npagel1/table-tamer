import { Center, MantineColorScheme, SegmentedControl } from "@mantine/core";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface ChangeColorThemeProps {
  selectedTheme: string;
  onThemeChange: (value: string) => void;
  mantineOnSchemeChange: (value: MantineColorScheme) => void;
}

export default function ChangeColorTheme(props: ChangeColorThemeProps) {
  const { i18n } = useTranslation();
  return (
    <SegmentedControl
      size="xs"
      value={props.selectedTheme}
      onChange={(newValue: string) => {
        props.onThemeChange(newValue);
        props.mantineOnSchemeChange(newValue as MantineColorScheme);
      }}
      data={[
        {
          value: "light",
          label: (
            <Center style={{ gap: 10 }}>
              <IconSunFilled
                color={props.selectedTheme === "light" ? "yellow" : "gray"}
              />
              <span>{i18n.t("account.light")}</span>
            </Center>
          ),
        },
        // {
        //   value: "auto",
        //   label: (
        //     <Center style={{ gap: 10 }}>
        //       <IconSunMoon
        //         color={props.selectedTheme === "auto" ? "lightblue" : "gray"}
        //       />
        //       <span>{i18n.t("account.auto")}</span>
        //     </Center>
        //   )
        // },
        {
          value: "dark",
          label: (
            <Center style={{ gap: 10 }}>
              <IconMoonFilled
                color={props.selectedTheme === "dark" ? "teal" : "gray"}
              />
              <span>{i18n.t("account.dark")}</span>
            </Center>
          )
        }
      ]}
    />
  )
}