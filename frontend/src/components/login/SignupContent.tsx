import { useState } from "react";
import { Anchor, Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { CustomerType } from "../../PageLayout";

interface SignupContentProps {
  /**
   * Fucntion to pass the customer info to be signed up
   * @param custInfo 
   */
  onSignupClick: (custInfo: CustomerType) => void;
  /**
   * Toggles the signup/login view
   */
  onToggle: () => void;
  /**
   * Error message for password validation
   */
  passwordError: string;
}

// Content used only for signing up a new customer
export default function SignupContent(props: SignupContentProps) {
  const { i18n } = useTranslation();
  // State variables to store input values
  const [nameValue, setNameValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [passwordValueConfirm, setPasswordValueConfirm] = useState<string>("");
  const [showPassMatchError, setShowPassMatchError] = useState<boolean>(false);

  return (
    <>
      <TextInput
        label={i18n.t("credentials.name")}
        value={nameValue}
        onChange={(event) => setNameValue(event.target.value)}
      />
      <TextInput
        label={i18n.t("credentials.email")}
        value={emailValue}
        onChange={(event) => setEmailValue(event.target.value)}
      />
      <TextInput
        label={i18n.t("credentials.phone")}
        value={phoneValue}
        onChange={(event) => {
          if (!/^[0-9]+$/.test(event.target.value)) {
            return;
          }
          setPhoneValue(event.target.value);
        }}
      />
      <PasswordInput
        label={i18n.t("credentials.password")}
        value={passwordValue}
        onChange={(event) => {
          setPasswordValue(event.target.value);
          if (showPassMatchError) {
            setShowPassMatchError(false);
          }
        }}
        error={showPassMatchError && i18n.t("signup.must-match")}
      />
      <PasswordInput
        label={i18n.t("signup.confirm-password")}
        value={passwordValueConfirm}
        onChange={(event) => {
          setPasswordValueConfirm(event.target.value);
          if (showPassMatchError) {
            setShowPassMatchError(false);
          }
        }}
        error={showPassMatchError && i18n.t("signup.must-match")}
      />
      {props.passwordError && (
        <Text color="red" size="sm" mt="xs">
          {props.passwordError}
        </Text>
      )}
      <Button
        style={{ width: "100%" }}
        mt="xs"
        onClick={() => {
          if (passwordValue !== passwordValueConfirm) {
            setShowPassMatchError(true);
            return;
          }

          const formattedDate = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
          const custInfo = {
            customer_name: nameValue,
            email: emailValue,
            phone: phoneValue,
            password_hash: passwordValue,
            created_at: formattedDate,
          };

          props.onSignupClick(custInfo);
        }}
      >
        {i18n.t("submit")}
      </Button>
      <Group gap="xs" justify="center">
        <Text ta="center" size="sm">
          {i18n.t("signup.has-account")}
        </Text>
        <Anchor
          component="button"
          size="sm"
          variant="transparent"
          onClick={props.onToggle}
        >
          {i18n.t("login.login")}
        </Anchor>
      </Group>
    </>
  );
}
