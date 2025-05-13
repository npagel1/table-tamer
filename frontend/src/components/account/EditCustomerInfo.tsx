import { useState } from "react";
import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { Navigate } from "react-router";
import { CustomerType } from "../../PageLayout";
import { useTranslation } from "react-i18next";

interface EditCustomerInfoProps {
  /**
   * Current logged in user
   */
  activeUser: CustomerType;
  /**
   * Handles updating the user's info w/ params passed in
   * @param newInfo User's new info to replace current info
   */
  onUpdateUserInfo: (newInfo: CustomerType) => void;
}

// Component for editing a user's info
export default function EditCustomerInfo(props: EditCustomerInfoProps) {
  const { i18n } = useTranslation();
  // State variables for store input values
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>(props.activeUser?.customer_name);
  const [emailValue, setEmailValue] = useState<string>(props.activeUser?.email);
  const [phoneValue, setPhoneValue] = useState<string>(props.activeUser?.phone);

  if (!props.activeUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Text size="sm" c="gray">{i18n.t("account.info")}</Text>
      <Stack gap="xs">
        <Group justify="space-between">
          {isEditMode &&
            <Button
              size="compact-xs"
              variant="subtle"
              onClick={() => setIsEditMode(false)}
            >
              {i18n.t("cancel")}
            </Button>
          }
          <Button
            ml="auto"
            size="compact-xs"
            variant="subtle"
            onClick={() => {
              if (isEditMode) {
                props.onUpdateUserInfo({
                  customer_id: props.activeUser.customer_id,
                  customer_name: nameValue,
                  email: emailValue,
                  phone: phoneValue,
                  password_hash: props.activeUser.password_hash,
                  created_at: props.activeUser.created_at
                });

                setIsEditMode(false);
              } else {
                setIsEditMode(true);
              }
            }}
          >
            {isEditMode ? i18n.t("account.save") : i18n.t("account.edit")}
          </Button>
        </Group>
        <TextInput
          value={isEditMode ? nameValue : props.activeUser?.customer_name}
          label={i18n.t("credentials.name")}
          disabled={!isEditMode}
          onChange={event => setNameValue(event.target.value)}
        />
        <TextInput
          value={isEditMode ? emailValue : props.activeUser?.email}
          label={i18n.t("credentials.email")}
          disabled={!isEditMode}
          onChange={event => setEmailValue(event.target.value)}
        />
        <TextInput
          value={isEditMode ? phoneValue : props.activeUser?.phone}
          label={i18n.t("credentials.phone")}
          disabled={!isEditMode}
          onChange={event => setPhoneValue(event.target.value)}
        />
        {isEditMode && (
          <Button
            mt="xs"
            size="xs"
            onClick={() => {
              props.onUpdateUserInfo({
                customer_id: props.activeUser.customer_id,
                customer_name: nameValue,
                email: emailValue,
                phone: phoneValue,
                password_hash: props.activeUser.password_hash,
                created_at: props.activeUser.created_at
              });
              setIsEditMode(false);
            }}
          >
            {i18n.t("account.save")}
          </Button>
        )}
      </Stack>
    </>
  );
}