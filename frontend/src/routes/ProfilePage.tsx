import { useContext, useState } from "react";
import { Alert, Avatar, Box, Button, Center, Divider, Fieldset, Group, Modal, Paper, Select, Stack, Text, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout2 } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../contexts/AuthContext";
import EditInfoSection from "../components/account/EditCustomerInfo";
import ChangePassword from "../components/account/ChangePasswordContent";
import ChangeColorTheme from "../components/ChangeColorTheme";

// ROUTE: Profile page for a customer or staff
export default function ProfilePage() {
  const { i18n } = useTranslation();
  const { activeUser, logout } = useContext(AuthContext);
  const [activeUserInfo, setActiveUserInfo] = useState<Record<string, any>>(activeUser);
  const [showAPIResponse, setShowAPIResponse] = useState<boolean>(false);
  const [apiResponse, setAPIResponse] = useState<Record<string, any>>({ success: null, message: ""});
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme: storedColorScheme, setColorScheme, /* clearColorScheme */ } = useMantineColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(storedColorScheme ?? "light");
  const [language, setLanguage] = useState<string>("en");

  function onThemeChange(value: string) {
    setSelectedTheme(value);
  }

  // Delete's the user's account
  async function deleteAccount() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${activeUser.customer_id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        notifications.show({
          "title": i18n.t("deleted"),
          message: data.message
        });
        logout();
      } else {
        notifications.show({
          "title": i18n.t("error"),
          message: i18n.t("account.delete-failed")
        });
      }
  
    } catch(error) {
      console.error('ERROR:', error);
    }
  }

  // Updates the user's info
  // TODO: make this work for staff as well
  async function updateUserInfo(updatedInfo: Record<string, any>, updatePassword: boolean = false) {
    const passwordValue = updatePassword === true
      ? updatedInfo.password_hash
      : activeUser.password_hash;

    const completeInfo = {
      customer_name: updatedInfo.customer_name,
      email: updatedInfo.email,
      phone: updatedInfo.phone,
      password_hash: passwordValue,
      // "create_at" should never be changed
      created_at: activeUser.created_at,
      // Add customer_pic and language from activeUser
      customer_pic: activeUser.customer_pic,
      language: activeUser.language,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${activeUser.customer_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeInfo),
      });

      if (response.ok) {
        // If API call was successful, reset the activeUser with new info,
        // so that the profile page content rerenders.
        const message = updatePassword ? i18n.t("account.password-updated") : i18n.t("account.profile-updated");
        setActiveUserInfo(completeInfo);
        notifications.show({ title: i18n.t("success"), message });
      } else {
        const message = updatePassword ? i18n.t("account.password-update-failed") : i18n.t("account.profile-update-failed");
        notifications.show({ title: i18n.t("error"), message });
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  const languages = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Español",
      value: "es",
    },
    {
      label: "Français",
      value: "fr"
    }
  ];
  
  return (
    <>
      <Stack mt="3em">
        {/* <Stack gap={0}> */}
          <Paper p="xs" withBorder>
            <Text mb="xs" size="sm" c="gray">{i18n.t("account.color-scheme")}</Text>
            <ChangeColorTheme
              selectedTheme={selectedTheme}
              onThemeChange={onThemeChange}
              mantineOnSchemeChange={setColorScheme}
            />
          </Paper>
        {/* </Stack> */}
        <Paper withBorder p="xs">
          <Text mb="xs" size="sm" c="gray">{i18n.t("language.language")}</Text>
          <Select
            // label={i18n.t("language.language")}
            data={languages}
            value={language}
            onChange={(newValue: string | null) => {
              if (newValue) {
                setLanguage(newValue);
                i18n.changeLanguage(newValue);
              }
            }}
          />
        </Paper>
        <Paper withBorder p="xs">
          <Center>  
            <Avatar
              name={activeUser.customer_name}
              color="initials"
              size="lg"
              style={{ alignSelf: "center" }}
            />
          </Center>
        </Paper>
        <EditInfoSection
          activeUser={activeUserInfo}
          onUpdateUserInfo={(newInfo: Record<string, any>) => {
            updateUserInfo(newInfo);
          }}
        />
        <ChangePassword
          activeUser={activeUserInfo}
          onUpdatePassword={(newInfo: Record<string, any>, updatePassword: boolean) => {
            updateUserInfo(newInfo, updatePassword);
          }}
        />
        <Divider />
        {/* <Space h="sm" /> */}
        <Stack>
          <Button
            justify="space-between"
            variant="light"
            onClick={logout}
            leftSection={<IconLogout2 />}
            rightSection={<span />}
          >
            {i18n.t("account.logout")}
          </Button>
          <Button
            size="compact-sm"
            color="red"
            style={{ alignSelf: "flex-start" }}
            onClick={open}
          >
            {i18n.t("account.delete-account")}
          </Button>
        </Stack>
      </Stack>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        {!showAPIResponse &&
          <>
            <Text>{i18n.t("account.are-you-sure")}</Text>
            <Group justify="flex-end">
              <Button onClick={close}>{i18n.t("cancel")}</Button>
              <Button onClick={deleteAccount}>{i18n.t("confirm")}</Button>
            </Group>
          </>
        }
        {showAPIResponse &&
          <Alert ta="center" title color={apiResponse.success ? "green" : "red"}>
            <Text>{apiResponse.message}</Text>
            <Text mt="xs">'${i18n.t("deleted")} ${i18n.t("account.logging-out")}'</Text>
          </Alert>
        }
      </Modal>
    </>
  )
}
