import { useState } from "react";
import { StaffType } from "../../PageLayout";
import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface EditStaffInfoProps {
  activeUser: StaffType;
  onUpdateStaffInfo: (newInfo: StaffType) => void;
}

export default function EditStaffInfo(props: EditStaffInfoProps) {
  const { i18n } = useTranslation();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>(props.activeUser?.staff_name);
  const [emailValue, setEmailValue] = useState<string>(props.activeUser?.email);
  const [phoneValue, setPhoneValue] = useState<string>(props.activeUser?.phone);

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
            mt="xs"
            size="compact-xs"
            variant="subtle"
            onClick={() => {
              if (isEditMode) {
                props.onUpdateStaffInfo({
                  staff_id: props.activeUser.staff_id,
                  staff_name: nameValue,
                  staff_role: props.activeUser.staff_role,
                  email: emailValue,
                  phone: phoneValue,
                  password_hash: props.activeUser.password_hash,
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
          value={isEditMode ? nameValue : props.activeUser?.staff_name}
          label={i18n.t("credentials.name")}
          disabled={!isEditMode}
          onChange={(event) => setNameValue(event.target.value)}
        />
        <TextInput
          value={isEditMode ? emailValue : props.activeUser?.email}
          label={i18n.t("credentials.email")}
          disabled={!isEditMode}
          onChange={(event) => setEmailValue(event.target.value)}
        />
        <TextInput
          value={isEditMode ? phoneValue : props.activeUser?.phone}
          label={i18n.t("credentials.phone")}
          disabled={!isEditMode}
          onChange={(event) => setPhoneValue(event.target.value)}
        />
        {/* <TextInput
          value={isEditMode ? roleValue : props.activeUser?.staff_role}
          label="Role"
          disabled={!isEditMode}
          onChange={(event) => setRoleValue(event.target.value)}
        /> */}
        {isEditMode && (
          <Button
            mt="xs"
            size="xs"
            onClick={() => {
              props.onUpdateStaffInfo({
                staff_id: props.activeUser.staff_id,
                staff_name: nameValue,
                staff_role: props.activeUser.staff_role,
                email: emailValue,
                phone: phoneValue,
                password_hash: props.activeUser.password_hash
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