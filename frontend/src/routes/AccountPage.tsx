import { useContext, useState } from "react";
import { Avatar, Button, Collapse, Group, Modal, Paper, Select, Stack, Text, useMantineColorScheme, em, DEFAULT_THEME } from "@mantine/core";
import { readLocalStorageValue, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconLogout2 } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";

import { AuthContext } from "../contexts/AuthContext";
import ChangeColorTheme from "../components/ChangeColorTheme";
import ChangePasswordContent from "../components/account/ChangePasswordContent";
import AvatarContent from "../components/account/AvatarContent";
import { CustomerType, StaffType } from "../PageLayout";
import EditCustomerInfo from "../components/account/EditCustomerInfo";
import EditStaffInfo from "../components/account/EditStaffInfo";

const languages = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
];

// ROUTE: Profile page for a customer or staff
export default function AccountPage() {
  const { i18n } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const { activeUser, logout } = useContext(AuthContext);
  const storedActiveUser = JSON.parse(readLocalStorageValue({ key: 'activeUser' }))
  const [activeUserInfo, setActiveUserInfo] = useState<CustomerType>(activeUser ?? storedActiveUser);
  const [activeStaffInfo, setActiveStaffInfo] = useState<StaffType>(activeUser);
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme: storedColorScheme, setColorScheme, /* clearColorScheme */ } = useMantineColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(storedColorScheme ?? "light");
  const [language, setLanguage] = useState<string>(activeUser?.language ?? i18n.language ?? "en");
  const [openedProfile , { toggle: toggleProfile }] = useDisclosure(true);
  const [openedSettings , { toggle: toggleSettings }] = useDisclosure(true);
  const isStaff = activeUser && "staff_role" in activeUser;
  const isTablet = useMediaQuery(`(min-width: ${em(750)})`);

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

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
        notifications.show({ "title": i18n.t("deleted") + " " + i18n.t("account.logging-out"), message: data.message });
        setTimeout(() => {
          logout();
        }, 2500);
      } else {
        notifications.show({ "title": i18n.t("error"), message: i18n.t("account.delete-failed") });
      }
  
    } catch(error) {
      console.error('ERROR:', error);
    }
  }
  
  async function updateCustomer(customerId: number, data: CustomerType): Promise<Response> {
    return fetch(`http://127.0.0.1:8000/api/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
  
  async function updateUserInfo(updatedInfo: CustomerType, updatePassword: boolean = false) {
    const updatePayload = {
      ...updatedInfo
    };

    const completeInfo: CustomerType = {
      customer_id: activeUser.customer_id,
      customer_name: updatePayload.customer_name,
      email: updatePayload.email,
      phone: updatePayload.phone,
      password_hash: updatePayload.password_hash,
      created_at: activeUser.created_at,
      customer_pic: updatePayload.customer_pic,
      language: updatePayload.language,
    };

    try {
      const response = await updateCustomer(activeUser.customer_id, completeInfo);

      if (response.ok) {
        // If API call was successfull, reset the activeUser w/ new info,
        // so that the profile page content rerenders.
        const message = updatePassword ? i18n.t("account.password-updated") : i18n.t("account.profile-updated");
        setActiveUserInfo(completeInfo);
        notifications.show({ title: i18n.t("success"), message });
      } else {
        const message = updatePassword ? i18n.t("account.password-update-failed") : i18n.t("account.profile-update-failed");
        notifications.show({ title: i18n.t("error"), message });
      }

    } catch(error) {
      console.error('ERROR:', error);
    }
  }

  async function updateStaffInfo(updatedInfo: StaffType, updatePassword: boolean = false) {
    const passwordValue = updatePassword === true
      ? updatedInfo.password_hash
      : activeUser.password_hash;

    const completeInfo: StaffType = {
      staff_id: activeUser.staff_id,
      staff_name: updatedInfo.staff_name,
      email: updatedInfo.email,
      staff_role: activeUser.staff_role,
      password_hash: passwordValue,
      phone: updatedInfo.phone ?? "",
      staff_pic: activeUser.staff_pic ?? "",
      language: activeUser.language ?? "",
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/staff/${activeUser.staff_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeInfo),
      });

      if (response.ok) {
        const message = "Profile has been updated!";
        setActiveStaffInfo(completeInfo);
        notifications.show({ title: i18n.t("success"), message });
      } else {
        const message = "Couldn't update profile!";
        notifications.show({ title: i18n.t("error"), message });
      }

    } catch(error) {
      console.error('ERROR:', error);
    }
  }

  const isBrowserColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let backgroundColor = DEFAULT_THEME.colors.dark[7];

  if (colorScheme === "light") {
    if (isStaff) {
      backgroundColor = DEFAULT_THEME.colors.gray[2];
    } else {
      backgroundColor = DEFAULT_THEME.white;
    }
  } else if (colorScheme === "auto") {
    if (!isBrowserColorSchemeDark) {
      backgroundColor = DEFAULT_THEME.white;
    }
  }
  
  return (
    <>
      <Stack mt="3em" gap={0}>
        <Paper shadow="sm" mb="sm">
          <Button
            size="lg"
            fullWidth
            onClick={toggleProfile}
            rightSection={<IconChevronDown />}
            justify="space-between"
          >
            {i18n.t("account.profile")}
          </Button>
        </Paper>
        <Collapse in={openedProfile} mb="lg">
          <Stack gap="xs">
            <Paper withBorder p="xs" shadow="sm">
              {isStaff &&
                <Stack gap="xs" align="center">
                  <Avatar name={activeUser?.staff_name ?? ""} />
                  <Text>{activeUser?.staff_name ?? ""}</Text>
                </Stack>
              }
              {!isStaff &&
                <AvatarContent
                  activeUser={activeUser}
                  userImage={activeUser?.customer_pic}
                  onUpdatePic={(newPic: string | null) => {
                    activeUser && updateUserInfo({...activeUser, customer_pic: newPic});
                  }}
                />
              }
            </Paper>
            <Paper withBorder p="xs" shadow="sm">
              {isStaff && (
                <EditStaffInfo
                  activeUser={activeStaffInfo}
                  onUpdateStaffInfo={(newInfo: StaffType) => {
                    updateStaffInfo(newInfo);
                  }}
                />
              )}
              {!isStaff && (
                <EditCustomerInfo
                  activeUser={activeUserInfo}
                  onUpdateUserInfo={(newInfo: CustomerType) => {
                    updateUserInfo(newInfo);
                  }}
                />
              )}
            </Paper>
            <Paper withBorder p="xs" shadow="sm">
              <ChangePasswordContent
                activeUser={activeUserInfo}
                onUpdatePassword={(newInfo: CustomerType | StaffType, updatePassword: boolean) => {
                  if (isStaff) {
                    updateStaffInfo(newInfo as StaffType, updatePassword);
                  } else {
                    updateUserInfo(newInfo as CustomerType, updatePassword);
                  }
                }}
              />
            </Paper>
          </Stack>
        </Collapse>

        {/* Settings Section */}
        {/* <Paper bg={backgroundColor}> */}
        <Paper shadow="sm" mb="sm">
          <Button
            size="lg"
            fullWidth
            onClick={toggleSettings}
            rightSection={<IconChevronDown />}
            justify="space-between"
          >
            {i18n.t("account.settings")}
          </Button>
        </Paper>
        <Collapse in={openedSettings}>
          <Stack gap="xs">
            <Paper withBorder p="xs" shadow="sm">
              <Text mb="xs" size="sm" c="gray">{i18n.t("language.language")}</Text>
              <Select
                data={languages}
                value={language}
                onChange={(newLanguage: string | null) => {
                  if (newLanguage) {
                    setLanguage(newLanguage);
                    i18n.changeLanguage(newLanguage);
                    if (isStaff) {
                      updateStaffInfo({...activeUser, language: newLanguage});
                    } else {
                      updateUserInfo({...activeUser, language: newLanguage});
                    }
                  }
                }}
              />
            </Paper>
            <Paper p="xs" withBorder shadow="sm">
              <Text mb="xs" size="sm" c="gray">{i18n.t("account.color-scheme")}</Text>
              <ChangeColorTheme
                selectedTheme={selectedTheme}
                onThemeChange={onThemeChange}
                mantineOnSchemeChange={setColorScheme}
              />
            </Paper>
          </Stack>
        </Collapse>
        
        {/* Logout & Delete account */}
        <Stack mt="xl">
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
        <>
          <Text mb="xs">{i18n.t("account.are-you-sure")}</Text>
          <Group justify="flex-end">
            <Button onClick={close}>{i18n.t("cancel")}</Button>
            <Button onClick={deleteAccount}>{i18n.t("confirm")}</Button>
          </Group>
        </>
      </Modal>

      {!isTablet && (
        <Group
          justify="space-between"
          mt="2em"
          w="100%"
        >
          <Text size="xs">
            {i18n.t("login.copyright")}
          </Text>
        </Group>
      )}
    </>
  );
}
