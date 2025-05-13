import { useState } from "react";
import { Anchor, Button, Group, PasswordInput, Text } from "@mantine/core";
import LoginSignupTabs from "./LoginSignupTabs";
import { useTranslation } from "react-i18next";
import { CustomerType, StaffType } from "../../PageLayout";

interface LoginContentProps {
  customers: CustomerType[];
  handlePasswordError: (value: string) => void;
  onLoginClick: (userParam: CustomerType | StaffType | undefined, password: string) => void;
  onToggle: () => void;
  passwordError: string;
  staff: StaffType[];
}

// Content specifically for logging in
export default function LoginContent(props: LoginContentProps) {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("customer");
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [noUserMessage, setNoUserMessage] = useState<string>();

  function handleSetActiveTab(value: string) {
    setActiveTab(value);
  }

  function handleSetUsernameValue(value: string) {
    setUsernameValue(value);
    setNoUserMessage("");
  }
  
  return (
    <>
      <LoginSignupTabs
        customers={props.customers}
        staff={props.staff}
        usernameValue={usernameValue}
        activeTab={activeTab}
        onSetActiveTab={handleSetActiveTab}
        onSetUsernameValue={handleSetUsernameValue}
        noUserMessage={noUserMessage}
      />
      <PasswordInput
        error={props.passwordError}
        label={i18n.t("credentials.password")}
        value={passwordValue}
        onChange={event => {
          setPasswordValue(event.target.value);
          props.passwordError !== "" && props.handlePasswordError("");
        }}
      />
      <Button
        style={{ width: "100%" }}
        mt="xs"
        onClick={() => {
          let foundUser: CustomerType | StaffType | undefined = undefined;

          if (activeTab ===  "customer") {
            foundUser = props.customers.find(user => user.customer_name === usernameValue);
          } else {
            foundUser = props.staff.find(user => user.staff_name === usernameValue);
          }
          if (foundUser) {
            props.onLoginClick(foundUser, passwordValue);
          } else {
            setNoUserMessage(`${i18n.t("credentials.username")} ${usernameValue} ${i18n.t("login.not-found")}`);
          }
        }}
      >
        {i18n.t("login.login")}
      </Button>
      <Group gap="xs" justify="center">
        <Text ta="center" size="sm">{i18n.t("login.no-account")}</Text>
        <Anchor
          component="button"
          size="sm"
          variant="transparent"
          onClick={props.onToggle}
        >
          {i18n.t("signup.signup")}
        </Anchor>
      </Group>
    </>
  );
}
