import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, PasswordInput, Stack, Switch, Text } from "@mantine/core";

import { CustomerType, StaffType } from "../../PageLayout";
import { useTranslation } from "react-i18next";

interface ChangePasswordProps {
  // Logged in user
  activeUser: CustomerType | StaffType;
  /**
   * Receives the other required fields for the db for user into to be updated
   * @param newInfo New info for the user values
   * @param updatePassword should the password value be changed or not
   */
  onUpdatePassword: (newInfo: CustomerType | StaffType, updatePassword: boolean) => void;
}

// Hangles changing a user's password
export default function ChangePasswordContent(props: ChangePasswordProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // State variables for storing input values
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [newPasswordValue, setNewPasswordValue] = useState<string>("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");
  const [passwordValueError, setPasswordValueError] = useState<string>();
  const [newPasswordValueError, setNewPasswordValueError] = useState<string>();
  const isStaff = props.activeUser && "staff_role" in props.activeUser;

  useEffect(() => {
    if (!props.activeUser) {
      navigate("/login");
    }
  }, [props.activeUser]);

  // Checks if the passwords match. If so, change password & empty out fields.
  // If not, throw related errors.
  function checkPasswordsMatch() {
    if (passwordValue !== props.activeUser.password_hash) {
      setPasswordValueError(i18n.t("login.incorrect-password"));
      return;
    }

    if (newPasswordValue !== confirmPasswordValue) {
      setNewPasswordValueError(i18n.t("account.no-match"));
      return;
    }

    if (passwordValue === newPasswordValue) {
      setNewPasswordValueError(i18n.t("account.must-use-new"));
      return;
    }

    if (isStaff) {
      props.onUpdatePassword({
        staff_id: (props.activeUser as StaffType).staff_id,
        staff_name: (props.activeUser as StaffType).staff_name,
        staff_role: (props.activeUser as StaffType).staff_role,
        email: props.activeUser.email,
        phone: (props.activeUser as StaffType).phone,
        password_hash: newPasswordValue,
      }, true);
    } else {
      props.onUpdatePassword({
        customer_id: (props.activeUser as CustomerType).customer_id,
        customer_name: (props.activeUser as CustomerType).customer_name,
        email: props.activeUser.email,
        phone: (props.activeUser as CustomerType).phone,
        password_hash: newPasswordValue,
        created_at: (props.activeUser as CustomerType).created_at
      }, true);
    }

    setShowChangePassword(false);
    setPasswordValue("");
    setNewPasswordValue("");
    setConfirmPasswordValue("");
  }

  return (
    <>
      <Text size="sm" c="gray" mb="xs" td="underline">{i18n.t("credentials.password")}</Text>
      <Switch
        label={i18n.t("account.change-password")}
        checked={showChangePassword}
        onChange={() => setShowChangePassword(prev => !prev)}
      />
      {showChangePassword &&
        <>
        <Stack gap="xs" mt="sm">
          <PasswordInput
            label={i18n.t("account.current-password")}
            value={passwordValue}
            error={passwordValueError && passwordValueError}
            onChange={event => {
              setPasswordValue(event.target.value);
              if (passwordValueError) {
                setPasswordValueError(undefined);
              }
            }}
          />
          <PasswordInput
            label={i18n.t("account.new-password")}
            value={newPasswordValue}
            error={newPasswordValueError && newPasswordValueError}
            onChange={event => {
              setNewPasswordValue(event.target.value);
              if (newPasswordValueError) {
                setNewPasswordValueError(undefined);
              }
            }}
          />
          <PasswordInput
            label={i18n.t("account.confirm-new-password")}
            value={confirmPasswordValue}
            error={newPasswordValueError && newPasswordValueError}
            onChange={event => setConfirmPasswordValue(event.target.value)}
          />
          <Button
            mt="xs"
            size="xs"
            onClick={() => {
              checkPasswordsMatch();
            }}
          >
            {i18n.t("account.save")}
          </Button>
        </Stack>
        </>
      }
    </>
  );
}