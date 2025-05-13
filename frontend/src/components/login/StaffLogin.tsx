import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function StaffLoginContent() {
  const { i18n } = useTranslation();
  return (
    <Stack>{i18n.t("login.staff-login")}</Stack>
  )
}